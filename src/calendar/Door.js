import React, { useState } from "react";
import { Button, Modal, Input, Header, Form } from "semantic-ui-react";

const exampleReducer = (state, action) => {
    switch (action.type) {
        case "OPEN_MODAL":
            return { open: true, dimmer: action.dimmer };
        case "CLOSE_MODAL":
            return { open: false };
        default:
            throw new Error();
    }
};

const Door = ({ question, answer, onSubmit }) => {
    const [state, dispatch] = React.useReducer(exampleReducer, {
        open: false,
        dimmer: undefined,
    });
    const { open, dimmer } = state;

    const [input, setInput] = useState(null);

    const door = question.door;
    const day = question.day ?? 25;
    const placeHolder = answer ? "Your new answer..." : "Your answer...";

    const canOpenDoor = () => {
        let newDate = new Date();
        let date = newDate.getDate();
        return day <= date;
    };

    const onChange = (event) => {
        setInput(event.target.value);
    };

    const onAnswerSubmit = () => {
        onSubmit(question.door, input);
        dispatch({ type: "CLOSE_MODAL" });
    };

    const getFirstLetterOfAnswer = (answer) => {
        return answer.substring(0, 1).toUpperCase();
    };

    const getBorder = () => {
        return answer ? "2px solid white" : "2px dashed white";
    };

    return (
        <div>
            <Button
                id={door}
                style={{
                    background: "none",
                    border: getBorder(),
                    width: "120px",
                    height: "100px",
                    color: "white",
                }}
                disabled={!canOpenDoor(day)}
                onClick={() => {
                    dispatch({ type: "OPEN_MODAL", dimmer: "blurring" });
                }}
            >
                <Header style={{ color: "white", fontSize: "xxx-large" }}>
                    {answer ? (
                        <>{getFirstLetterOfAnswer(answer)}</>
                    ) : (
                        <>{day && day}</>
                    )}
                </Header>
            </Button>

            <Modal
                dimmer={dimmer}
                open={open}
                className="door_modal"
                style={{ width: "fit-content" }}
                onClose={() => dispatch({ type: "CLOSE_MODAL" })}
            >
                <Modal.Content style={{ background: "#651a22" }}>
                    {question.question && (
                        <>
                            <Header
                                as="h2"
                                style={{ textAlign: "center", color: "white" }}
                            >
                                {question.question}
                            </Header>
                            {answer && (
                                <Header
                                    as="h2"
                                    style={{
                                        textAlign: "center",
                                        color: "white",
                                    }}
                                >
                                    Your answer: {answer}
                                </Header>
                            )}
                            <Form onSubmit={onAnswerSubmit}>
                                <Form.Field>
                                    <Input
                                        onChange={onChange}
                                        placeholder={placeHolder}
                                    />
                                </Form.Field>

                                <Button
                                    type="submit"
                                    style={{
                                        color: "white",
                                        backgroundColor: "#002d26",
                                    }}
                                    color="white"
                                    size="big"
                                >
                                    Submit
                                </Button>
                                <Button
                                    type="submit"
                                    style={{
                                        color: "white",
                                        backgroundColor: "#2d323b",
                                    }}
                                    size="big"
                                    onClick={() =>
                                        dispatch({ type: "CLOSE_MODAL" })
                                    }
                                >
                                    Close
                                </Button>
                            </Form>
                        </>
                    )}
                </Modal.Content>
            </Modal>
        </div>
    );
};

export default Door;
