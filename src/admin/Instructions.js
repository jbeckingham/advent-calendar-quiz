import React, { useState } from "react";
import { Button, List, Modal } from "semantic-ui-react";

function Instructions() {
    const [open, setOpen] = useState(false);

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={
                <Button className="admin-button">
                    Configuration Instructions
                </Button>
            }
            dimmer="blurring"
        >
            <Modal.Header>Configuration Instructions</Modal.Header>
            <Modal.Content>
                <List bulleted>
                    <List.Item>Apples</List.Item>
                    <List.Item>Pears</List.Item>
                    <List.Item>Oranges</List.Item>
                </List>
            </Modal.Content>
            <Modal.Actions>
                <Button color="grey" onClick={() => setOpen(false)}>
                    Close
                </Button>
            </Modal.Actions>
        </Modal>
    );
}

export default Instructions;
