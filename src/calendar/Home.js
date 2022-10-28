import React, { useState, useEffect } from "react";
import { Loader } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import Calendar from "./Calendar";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { partition, propEq, sortBy, prop, pipe } from "ramda";

const Home = () => {
    const { id, key } = useParams();

    const [name, setName] = useState(null);
    const [questions, setQuestions] = useState(null);
    const [userAnswers, setUserAnswers] = useState(null);

    const getAnswers = async (name) => {
        const response = db
            .collection("answers")
            .where("calendar_id", "==", parseInt(id))
            .where("name", "==", name);
        const data = await response.get();
        const resultsArray = data.docs.map((doc) => {
            const data = doc.data();
            data.id = doc.id;
            return data;
        });
        setUserAnswers(resultsArray);
    };

    const ready = name && questions && userAnswers;

    const onSubmit = async (day, answer) => {
        const answerId = userAnswers.find((answer) => day === answer.door)?.id;
        if (answerId) {
            const answerRef = doc(db, "answers", answerId);
            await updateDoc(answerRef, {
                value: answer,
            });
        } else {
            db.collection("answers")
                .add({
                    name: name,
                    calendar_id: parseInt(id),
                    door: day,
                    value: answer,
                })
                .catch(function (error) {
                    console.error("Error adding document: ", error);
                });
        }
        getAnswers(name);
    };

    useEffect(() => {
        const getUserData = async () => {
            const response = db
                .collection("users")
                .where("calendar_id", "==", parseInt(id))
                .where("url", "==", key);
            const data = await response.get();
            const retrievedName = data.docs[0].data().name;
            if (!retrievedName) {
            } else {
                setName(data.docs[0].data().name);
                getAnswers(data.docs[0].data().name);
            }
        };

        const setMissingDays = (questions) => {
            const takenDays = questions.map((i) => i.day);
            const nonAssignedDays = [...Array(24).keys()]
                .map((x, i) => i + 1)
                .filter((i) => !takenDays.includes(i));
            const [incomplete, complete] = partition(
                propEq("day", 0),
                questions
            );
            const toAdd = incomplete.map((q, n) => ({
                ...q,
                day: nonAssignedDays[n],
            }));
            const result = sortBy(prop("door"), complete.concat(toAdd));
            return result;
        };

        const getQuestions = async () => {
            const response = db
                .collection("questions")
                .where("calendar_id", "==", parseInt(id))
                .orderBy("door", "asc");
            const data = await response.get();
            const resultsArray = data.docs.map((doc) => doc.data());
            const finalResults = setMissingDays(resultsArray);
            setQuestions(finalResults);
        };
        getUserData();
        getQuestions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {!ready ? (
                <Loader active size="huge" />
            ) : (
                <Calendar
                    questions={questions}
                    userAnswers={userAnswers}
                    onSubmit={onSubmit}
                />
            )}
        </>
    );
};

export default Home;
