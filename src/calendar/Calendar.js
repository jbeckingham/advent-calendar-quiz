import React from "react";
import { Grid, GridColumn } from "semantic-ui-react";
import Door from "./Door.js";
import Snowflakes from "magic-snowflakes";
const snowflakes = new Snowflakes({ color: "white", speed: 2 });
snowflakes.start();

const Calendar = ({ questions, userAnswers, onSubmit }) => {
    const getAnswer = (question) => {
        return userAnswers.find((answer) => question.door === answer.door)
            ?.value;
    };

    return (
        <div className="calendar">
            <Grid columns={6} doubling>
                {questions.map((question, i) => (
                    <GridColumn key={i}>
                        <Door
                            question={question}
                            answer={getAnswer(question)}
                            onSubmit={onSubmit}
                        />
                    </GridColumn>
                ))}
            </Grid>
        </div>
    );
};

export default Calendar;
