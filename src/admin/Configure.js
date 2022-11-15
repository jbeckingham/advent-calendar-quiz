import React, { useState, useEffect } from "react";
import { Button, Header, Modal, Grid } from "semantic-ui-react";
import { db } from "../firebase";
import QuestionConfig from "./QuestionConfig";
import { setDoc, doc } from "firebase/firestore";

const Configure = ({ id, password }) => {
  const [calendarData, setCalendarData] = useState([]);

  const [open, setOpen] = useState(false);

  const takenDays = calendarData.map((i) => i.day);
  const dayOptions = [...Array(24).keys()]
    .map((x, i) => i + 1)
    .filter((i) => !takenDays.includes(i));

  const getCalendarDataFromStore = async () => {
    const response = db
      .collection("questions")
      .where("calendar_id", "==", parseInt(id))
      .orderBy("door", "asc");
    const result = await response.get();
    const data = result.docs.map((doc) => {
      const data = doc.data();
      data.id = doc.id;
      return data;
    });
    setCalendarData(data);
  };

  const onQuestionSave = async ({ docId, day, door, question, answer }) => {
    // to do: error handling
    await setDoc(doc(db, "questions", docId), {
      calendar_id: parseInt(id),
      day,
      door,
      question,
      answer,
    });
    getCalendarDataFromStore();
  };

  useEffect(() => {
    const getCalendarData = async () => {
      getCalendarDataFromStore();
    };

    getCalendarData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const DayWarning = () => (
    <div className="warning">
      <p>
        You currently have not assigned all days. All doors without a day
        assigned will get assigned one from the days not assigned.
      </p>
    </div>
  );
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button className="admin-button">Configure Quiz</Button>}
      dimmer="blurring"
    >
      <Modal.Header>Configure Quiz</Modal.Header>
      <Modal.Content>
        <p>
          Remember, the door ordering on the left corresponds to the door
          position, left to right, top to bottom, not day of December. The day
          of December each door will be available is set in the right hand
          column.
        </p>
        {dayOptions.length > 0 && <DayWarning />}
        <Modal.Description>
          <Grid>
            <Grid.Row>
              <Grid.Column mobile={4} tablet={1} computer={1}>
                <Header>Door</Header>
              </Grid.Column>
              <Grid.Column mobile={4} tablet={7} computer={7}>
                <Header>Question</Header>
              </Grid.Column>
              <Grid.Column mobile={4} tablet={4} computer={4}>
                <Header>Answer</Header>
              </Grid.Column>
              <Grid.Column mobile={4} tablet={2} computer={2}>
                <Header>Day</Header>
              </Grid.Column>
              {/* <Grid.Column mobile={4} tablet={4} computer={2}></Grid.Column> */}
            </Grid.Row>
          </Grid>
          <Grid columns="equal" stackable>
            {calendarData.map((data, i) => (
              <QuestionConfig
                data={data}
                onQuestionSave={onQuestionSave}
                key={i}
                dayOptions={dayOptions}
              />
            ))}
          </Grid>
        </Modal.Description>
        {dayOptions.length > 0 && <DayWarning />}
      </Modal.Content>
      <Modal.Actions>
        <Button color="grey" onClick={() => setOpen(false)}>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default Configure;
