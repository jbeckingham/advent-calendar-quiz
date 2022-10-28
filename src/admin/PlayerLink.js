import React, { useState } from "react";
import { Button, Icon } from "semantic-ui-react";
import { CopyToClipboard } from "react-copy-to-clipboard";

const PlayerLink = ({ url }) => {
    const [active, setActive] = useState(false);

    const handleClick = () => {
        setActive(true);
        setTimeout(() => setActive(false), 3000);
    };

    const text = window.location.href.replace("admin", "") + url;

    const buttonText = active ? "Copied": "Link"

    return (
        <div className="link">
            <CopyToClipboard text={text} onCopy={handleClick}>
                <Button
                    color={active ? "green" : "blue"}
                    icon={active ? true : false}
                    size="small"
                >
                    {buttonText}
                </Button>
            </CopyToClipboard>
        </div>
    );
};

export default PlayerLink;
