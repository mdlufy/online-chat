import React from "react";
import Greeting from "../Greeting/Greeting";
import MessageItem from "../MessageItem/MessageItem";

function MessageList({ messages }) {
    return (
        <div className="messages">
            {messages.map((message) => 
                <div key={message.time}>
                    {message.event === "connection" && (
                        <Greeting message={message} />
                    )}
                    {message.event === "message" && (
                        <MessageItem message={message} />
                    )}
                </div>
            )}
        </div>
    );
}

export default MessageList;
