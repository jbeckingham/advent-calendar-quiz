import React, { useState, useEffect } from "react";
import { Button, Header, Modal, Grid, List } from "semantic-ui-react";
import { db } from "../firebase";
import { groupBy, prop, toPairs, pipe, indexBy, map, sortBy } from "ramda";

const numberToOrdinal = (n) =>
  n == 1 ? "1st" : n == 2 ? "2nd" : n == 3 ? "3rd" : n + "th";

const ViewAnswers = ({ id }) => {
  const [doorAnswers, setDoorAnswers] = useState([]);

  const [open, setOpen] = useState(false);

  const processFireBaseData = (result) => {
    return result.docs.map((doc) => {
      const data = doc.data();
      data.id = doc.id;
      return data;
    });
  };

  const getDataFromStore = async () => {
    const answerResponse = db
      .collection("answers")
      .where("calendar_id", "==", parseInt(id));
    const answerData = await answerResponse.get();
    const questionResponse = db
      .collection("questions")
      .where("calendar_id", "==", parseInt(id));
    const questionResult = await questionResponse.get();
    const questionDataMap = pipe(
      processFireBaseData,
      indexBy(prop("door"))
    )(questionResult);
    const resultsArray = processFireBaseData(answerData);
    const doorAnswers = pipe(
      groupBy(prop("door")),
      toPairs,
      map(([door, answers]) => ({
        door,
        answers,
        day: questionDataMap[door].day,
        answer: questionDataMap[door].answer,
        question: questionDataMap[door].question,
      })),
      sortBy(prop("day"))
    )(resultsArray);
    setDoorAnswers(doorAnswers);
  };

  useEffect(() => {
    const getData = async () => {
      getDataFromStore();
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button className="admin-button">View Answers</Button>}
      dimmer="blurring"
    >
      <Modal.Header>Player Answers</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Grid>
            {doorAnswers.map(({ door, answers, answer, question, day }) => (
              <Grid.Row columns={2} key={door}>
                <Grid.Column>
                  <span style={{ fontWeight: "100", fontSize: "20px" }}>
                    {numberToOrdinal(day)} December
                  </span>
                  <br /> <b>Question:</b> {question} <br />
                  <b>Correct Answer:</b> {answer}
                </Grid.Column>
                <Grid.Column>
                  {answers ? (
                    <List>
                      {answers.map((answer) => (
                        <List.Item>
                          {answer.name}: {answer.value}
                        </List.Item>
                      ))}
                    </List>
                  ) : (
                    <p>No answers yet.</p>
                  )}
                </Grid.Column>
              </Grid.Row>
            ))}
          </Grid>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="grey" onClick={() => setOpen(false)}>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ViewAnswers;
