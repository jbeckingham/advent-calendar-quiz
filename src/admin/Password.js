import React from "react";
import { Button, Input, Grid, Form } from "semantic-ui-react";

const Password = ({ onChange, onSubmit, correctPassword, loading }) => {
    const warningText = correctPassword === false ? "Incorrect password" : "";
    return (
        <>
            <Grid
                textAlign="center"
                style={{ height: "calc(100vh - 190px)" }}
                verticalAlign="middle"
            >
                <Grid.Row>
                    <Grid.Column>
                        <Grid textAlign="center">
                            <Grid.Row>
                                <Form onSubmit={onSubmit}>
                                    <Form.Field>
                                        <Input
                                            placeholder="Enter the admin password"
                                            size="massive"
                                            onChange={onChange}
                                            autoFocus
                                        />
                                    </Form.Field>
                                    <p
                                        style={{
                                            color: "red",
                                            height: "10px",
                                        }}
                                    >
                                        {warningText}
                                    </p>

                                    <Button
                                        type="submit"
                                        size="huge"
                                        color="olive"
                                        loading={loading}
                                    >
                                        Submit
                                    </Button>
                                </Form>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </>
    );
};

export default Password;
