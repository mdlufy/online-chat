import React from "react";
import Goodby from "../../connectionMessage/Goodby/Goodby";
import Greeting from "../../connectionMessage/Greeting/Greeting";
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
                    {message.event === "disconnect" && (
                        <Goodby message={message} />
                    )}
                </div>
            )}
        </div>
    );
}

export default MessageList;
