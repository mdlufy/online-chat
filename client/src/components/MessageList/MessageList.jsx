import React from "react";
import Greeting from "../Greeting/Greeting";
import Message from "../Message/Message";

function MessageList({ messages }) {
    return (
        <div className="messages">
            {messages.map((message) => (
                <div key={message.id}>
                    {message.event === "connection" && (
                        <Greeting message={message} />
                    )}
                    {message.event === "message" && (
                        <Message message={message} />
                    )}
                </div>
            ))}
        </div>
    );
}

export default MessageList;
