import React, { useState } from "react";
import { Header } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import Password from "./Password";
import AdminPanel from "./AdminPanel.js";
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

const Admin = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(null);
    const [password, setPassword] = useState(false);
    const [correctPassword, setCorrectPassword] = useState(null);

    const onPasswordInputChange = (event) => {
        setPassword(event.target.value);
    };

    const onPasswordSubmit = () => {
        setLoading(true);
        const verifyPassword = httpsCallable(functions, "verifyPassword");

        verifyPassword({ password: password, id: id }).then(function (result) {
            setCorrectPassword(result.data);
            if (!result.data) {
                setTimeout(() => setCorrectPassword(null), 5000);
            }
            setLoading(false);
        });
    };

    const onPasswordUpdateSuccess = (newPassword) => {
        setPassword(newPassword);
    };

    return (
        <div className="admin">
            {id ? (
                <>
                    {correctPassword ? (
                        <>
                            <AdminPanel
                                id={id}
                                password={password}
                                onPasswordUpdateSuccess={
                                    onPasswordUpdateSuccess
                                }
                            />
                        </>
                    ) : (
                        <Password
                            onChange={onPasswordInputChange}
                            onSubmit={onPasswordSubmit}
                            correctPassword={correctPassword}
                            loading={loading}
                        />
                    )}
                </>
            ) : (
                <Header as="h1" color="red">
                    No calendar id specified
                </Header>
            )}
        </div>
    );
};

export default Admin;
