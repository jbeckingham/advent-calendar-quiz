import React, { useState } from "react";
import { Button, Input, Grid, Icon } from "semantic-ui-react";
import PlayerLink from "./PlayerLink";

function PlayerConfig({ player, onPlayerSave, onRemovePlayer }) {
    const [name, setName] = useState(player.name);
    const [url, setUrl] = useState(player.url);
    const [loading, setLoading] = useState(false);
    const [removeLoading, setRemoveLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const buttonColour = success ? "green" : "grey";
    const buttonText = success ? "Saved" : "Save";

    const onNameChange = (event) => {
        setName(event.target.value);
    };

    const onUrlChange = (event) => {
        setUrl(event.target.value);
    };

    const savePlayer = async () => {
        setLoading(true);
        await onPlayerSave(player.id, name, url);
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
        }, 3000);
    };

    const removePlayer = async () => {
        setRemoveLoading(true);
        await onRemovePlayer(player.id);
        setRemoveLoading(false);
    };

    const showButton = name !== player.name || url !== player.url || success;

    return (
        <Grid.Row>
            <Grid.Column width={4}>
                <Input
                    style={{ width: "100%" }}
                    onChange={onNameChange}
                    defaultValue={player.name}
                ></Input>
            </Grid.Column>
            <Grid.Column width={7}>
                <Input
                    style={{ width: "100%" }}
                    onChange={onUrlChange}
                    defaultValue={player.url}
                ></Input>
            </Grid.Column>
            <Grid.Column width={2}>
                <PlayerLink url={player.url} />
            </Grid.Column>
            <Grid.Column width={3}>
                {showButton ? (
                    <Button
                        loading={loading}
                        color={buttonColour}
                        onClick={savePlayer}
                        size="small"
                    >
                        {buttonText}
                    </Button>
                ) : (
                    <Button
                        loading={removeLoading}
                        color="red"
                        onClick={removePlayer}
                        size="mini"
                        icon
                        style={{ marginTop: "5px" }}
                        inverted
                    >
                        <Icon name="trash alternate outline" />
                    </Button>
                )}
            </Grid.Column>
        </Grid.Row>
    );
}

export default PlayerConfig;
