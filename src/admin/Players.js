import React, { useState, useEffect } from "react";
import { Button, Header, Modal, Grid } from "semantic-ui-react";
import { db } from "../firebase";
import PlayerConfig from "./PlayerConfig";
import { collection, addDoc, setDoc, doc, deleteDoc } from "firebase/firestore";

function Players({ id, password }) {
    const [playerData, setPlayerData] = useState([]);

    const [open, setOpen] = useState(false);

    const getPlayerDataFromStore = async () => {
        const response = db
            .collection("users")
            .where("calendar_id", "==", parseInt(id));
        const result = await response.get();
        const data = result.docs.map((doc) => {
            const data = doc.data();
            data.id = doc.id;
            return data;
        });
        setPlayerData(data);
    };

    const addPlayer = async () => {
        // to do: error handling
        await addDoc(collection(db, "users"), {
            calendar_id: parseInt(id),
            name: "",
            url: "",
        });
        getPlayerDataFromStore();
    };

    const onPlayerSave = async (docId, name, url) => {
        // to do: error handling
        await setDoc(doc(db, "users", docId), {
            calendar_id: parseInt(id),
            name: name,
            url: url,
        });
        getPlayerDataFromStore();
    };

    const onRemovePlayer = async (docId) => {
        // to do: error handling
        await deleteDoc(doc(db, "users", docId));
        getPlayerDataFromStore();
    };

    useEffect(() => {
        const getPlayerData = async () => {
            getPlayerDataFromStore();
        };

        getPlayerData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={<Button className="admin-button">Manage Players</Button>}
            dimmer="blurring"
        >
            <Modal.Header>Manage Players</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={4}>
                                <Header>Name</Header>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Header>Url</Header>
                            </Grid.Column>
                            <Grid.Column width={3}></Grid.Column>
                        </Grid.Row>
                        {playerData.map((player, i) => (
                            <PlayerConfig
                                player={player}
                                onPlayerSave={onPlayerSave}
                                onRemovePlayer={onRemovePlayer}
                                key={i}
                            />
                        ))}
                    </Grid>
                    <Button style={{ marginTop: "25px" }} onClick={addPlayer}>
                        Add player
                    </Button>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button color="grey" onClick={() => setOpen(false)}>
                    Close
                </Button>
            </Modal.Actions>
        </Modal>
    );
}

export default Players;
