import React from "react";

function MessageItem({ message }) {
    console.log(message);
    const {serverTime: timestamp} = message;

    const date = new Date(timestamp);
    const time = date.getHours() + ":" + date.getMinutes();

    return (
        <div className="message">
            <span>{message.username}: </span>
            <span>{message.text}</span>
            <span style={{ float: "right" }}>{time}</span>
        </div>
    );
}

export default MessageItem;
