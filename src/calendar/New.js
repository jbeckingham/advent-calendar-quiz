import React, { useState } from "react";
import {
  Button,
  Input,
  Grid,
  Form,
  Modal,
  Header,
  Loader,
} from "semantic-ui-react";
import { collection, addDoc, writeBatch, doc } from "firebase/firestore";
import { db } from "../firebase";
import { pluck, pipe, head, forEach } from "ramda";

const New = ({}) => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(false);
  const [open, setOpen] = React.useState(false);

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const onSubmit = async () => {
    setOpen(false);
    setLoading(true);
    const newId = parseInt(await getNewId());
    try {
      await addNewQuiz(newId);
      await addQuestions(newId);
      window.location.href = newId + "/admin";
    } catch (err) {
      console.log("err", err);
    }
  };

  const processFireBaseData = (result) => {
    return result.docs.map((doc) => {
      const data = doc.data();
      data.id = doc.id;
      return data;
    });
  };

  const getNewId = async () => {
    const calendars = await db
      .collection("admin")
      .orderBy("calendar_id", "desc")
      .get();

    const lastId = pipe(
      processFireBaseData,
      pluck("calendar_id"),
      head
    )(calendars);
    return lastId ? lastId + 1 : 1;
  };

  const addNewQuiz = async (newId) => {
    return addDoc(collection(db, "admin"), {
      calendar_id: newId,
      password: value,
    });
  };

  const addQuestions = async (newId) => {
    const batch = writeBatch(db);
    const days = [...Array(24).keys()].map((x, i) => i + 1);

    forEach((day) => {
      const newQuestionRef = db.collection("questions").doc();
      batch.set(newQuestionRef, {
        calendar_id: newId,
        door: day,
        day: day,
        question: "",
        answer: "",
      });
    }, days);

    // Commit the batch
    return batch.commit();
  };

  return (
    <>
      {loading ? (
        <Loader active inverted size="massive">
          Creating new quiz...
        </Loader>
      ) : (
        <Grid
          textAlign="center"
          style={{ height: "calc(100vh - 190px)" }}
          verticalAlign="middle"
        >
          <Grid.Row>
            <Grid.Column>
              <Header size="huge" inverted>
                Create a new Advent Quiz
              </Header>
              <Grid textAlign="center">
                <Grid.Row>
                  <Form>
                    <Form.Field>
                      <Input
                        placeholder="Enter the admin password"
                        size="massive"
                        onChange={onChange}
                        autoFocus
                      />
                    </Form.Field>
                    <Modal
                      onClose={() => setOpen(false)}
                      onOpen={() => setOpen(true)}
                      open={open}
                      size="small"
                      trigger={<Button>Create Quiz</Button>}
                    >
                      <Header>Are you sure?</Header>
                      <Modal.Content>
                        <p>
                          A quiz will be created with the admin password{" "}
                          <b>{value}</b>. Please make sure you remember this as
                          we do not have password reset at this time.
                        </p>
                      </Modal.Content>
                      <Modal.Actions>
                        <Button
                          basic
                          color="red"
                          onClick={() => setOpen(false)}
                        >
                          Nevermind
                        </Button>
                        <Button color="green" onClick={onSubmit}>
                          Go!
                        </Button>
                      </Modal.Actions>
                    </Modal>
                  </Form>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )}
    </>
  );
};

export default New;
