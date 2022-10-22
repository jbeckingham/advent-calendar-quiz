import React, { useState, useEffect } from "react";
import { Button, Header, Modal, Grid } from "semantic-ui-react";
import { db } from "../firebase";
import QuestionConfig from "./QuestionConfig";
import { collection, addDoc, setDoc, doc, deleteDoc } from "firebase/firestore";

function Configure({ id, password }) {
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
                You currently have not assigned all days. All doors without a
                day assigned will become available on the 1st of December.
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
                {dayOptions.length > 0 && <DayWarning />}
                <Modal.Description>
                    <Grid columns={5}>
                        <Grid.Row>
                            <Grid.Column width={1}>
                                <Header>Door</Header>
                            </Grid.Column>
                            <Grid.Column width={7}>
                                <Header>Question</Header>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Header>Answer</Header>
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <Header>Day</Header>
                            </Grid.Column>
                            <Grid.Column width={2}></Grid.Column>
                        </Grid.Row>
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
}

export default Configure;
