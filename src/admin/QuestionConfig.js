import React, { useState } from "react";
import {
  Button,
  Input,
  Grid,
  TextArea,
  Header,
  Dropdown,
  Form,
} from "semantic-ui-react";

function QuestionConfig({ data, onQuestionSave, dayOptions }) {
  const [question, setQuestion] = useState(data.question);
  const [answer, setAnswer] = useState(data.answer);
  const [day, setDay] = useState(data.day);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const buttonColour = success ? "green" : "grey";
  const buttonText = success ? "Saved" : "Save";

  const onQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const onAnswerChange = (event) => {
    setAnswer(event.target.value);
  };

  const onDayChange = (event, data) => {
    setDay(data.value);
  };

  const saveData = async () => {
    setLoading(true);
    await onQuestionSave({
      question,
      answer: answer ? answer : "",
      day,
      door: data.door,
      docId: data.id,
    });
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  const showButton =
    question !== data.question ||
    answer !== data.answer ||
    day !== data.day ||
    success;

  const disableFields = success || loading;

  const baseOptions = [
    {
      text: "None",
      value: 0,
      key: 0,
    },
  ].concat(
    dayOptions.map((dayOption) => ({
      text: String(dayOption),
      value: dayOption,
      key: dayOption,
    }))
  );
  const dropdownOptions =
    data.day === 0
      ? baseOptions
      : baseOptions.concat([
          {
            text: String(data.day),
            value: data.day,
            key: data.day,
          },
        ]);

  return (
    <Grid.Row>
      <Grid.Column width={1}>
        <Header>{data.door}</Header>
      </Grid.Column>
      <Grid.Column width={7}>
        <Form>
          <TextArea
            disabled={disableFields}
            rows={2}
            onChange={onQuestionChange}
            defaultValue={data.question}
            placeholder="Question"
          />
        </Form>
      </Grid.Column>
      <Grid.Column width={4} style={{ padding: 0 }}>
        <Input
          disabled={disableFields}
          onChange={onAnswerChange}
          defaultValue={data.answer}
          placeholder="Answer"
        ></Input>
      </Grid.Column>
      <Grid.Column width={2} style={{ padding: 0 }}>
        <Dropdown
          disabled={disableFields}
          selection
          onChange={onDayChange}
          defaultValue={data.day}
          options={dropdownOptions}
          style={{ width: "70px", minWidth: "0px" }}
        ></Dropdown>
      </Grid.Column>
      <Grid.Column width={2}>
        {showButton && (
          <Button
            loading={loading}
            color={buttonColour}
            onClick={saveData}
            size="small"
          >
            {buttonText}
          </Button>
        )}
      </Grid.Column>
    </Grid.Row>
  );
}

export default QuestionConfig;
