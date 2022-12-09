import React from "react";

function MessageItem({ message, sendReaction, username }) {
    const {serverTime: timestamp, clientTime, username: messageAuthor} = message;

    const date = new Date(timestamp);
    const time = date.getHours() + ":" + date.getMinutes();

    function handleClick() {
        if (username !== messageAuthor) {
            sendReaction(clientTime);
        }
    }

    return (
        <div className="message">
            <span>{message.username}: </span>
            <span>{message.text}</span>
            <span onClick={handleClick} style={{ float: "right", cursor: 'pointer' }}>{message.reaction ? 'true' : 'false'}</span>
            <span style={{ float: "right", marginRight: 5 }}>{time}</span>
        </div>
    );
}

export default MessageItem;
