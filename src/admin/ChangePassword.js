import React, { useState } from "react";
import { Button, Modal, Input, Form } from "semantic-ui-react";
import {
    getFunctions,
    httpsCallable,
    connectFunctionsEmulator,
} from "firebase/functions";
import { getApp } from "firebase/app";

// Below for local firebase functions
// const functions = getFunctions(getApp());
// connectFunctionsEmulator(functions, "localhost", 5001);

// Below for prod firebase functions
const functions = getFunctions();

function ChangePassword({ id, password, onPasswordUpdateSuccess }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(null);
    const [result, setResult] = useState(null);
    const messageColour = result ? "green" : "red";
    const [value, setValue] = useState(null);
    const message =
        result === true
            ? "Successfully updated password to: " + password
            : result === false
            ? "Error updating password. Please try again or contact Jen."
            : "";

    const onChange = (event) => {
        setValue(event.target.value);
    };

    const onSubmit = () => {
        if (value) {
            setLoading(true);
            const changePassword = httpsCallable(functions, "changePassword");

            changePassword({
                newPassword: value,
                id: id,
                password: password,
            }).then(function (result) {
                console.log("result", result);
                setResult(result.data);
                setTimeout(() => setResult(null), 5000);
                setLoading(false);
                onPasswordUpdateSuccess(value);
            });
        }
    };

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={<Button className="admin-button">Change Password</Button>}
            dimmer="blurring"
        >
            <Modal.Header>Change Password</Modal.Header>
            <Form onSubmit={onSubmit}>
                <Modal.Content image>
                    <Modal.Description>
                        <Form.Field>
                            <Input
                                style={{ margin: "15px", width: "80%" }}
                                onChange={onChange}
                                autoFocus
                                placeholder="New Password"
                            />
                        </Form.Field>
                        <p
                            style={{
                                margin: "15px",
                                width: "80%",
                                color: messageColour,
                                height: "10px",
                            }}
                        >
                            {message}
                        </p>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        content="Submit password change"
                        labelPosition="right"
                        icon="checkmark"
                        type="submit"
                        color="green"
                        loading={loading}
                    />
                    <Button color="grey" onClick={() => setOpen(false)}>
                        Close
                    </Button>
                </Modal.Actions>
            </Form>
        </Modal>
    );
}

export default ChangePassword;
