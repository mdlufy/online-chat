import React from "react";

function MessageItem({ message, sendReaction }) {
    const {serverTime: timestamp, clientTime} = message;

    const date = new Date(timestamp);
    const time = date.getHours() + ":" + date.getMinutes();

    return (
        <div className="message">
            <span>{message.username}: </span>
            <span>{message.text}</span>
            <span onClick={() => sendReaction(clientTime)} style={{ float: "right", cursor: 'pointer' }}>{message.reaction ? 'true' : 'false'}</span>
            <span style={{ float: "right", marginRight: 5 }}>{time}</span>
        </div>
    );
}

export default MessageItem;
