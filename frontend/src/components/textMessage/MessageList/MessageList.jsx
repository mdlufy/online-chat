import React from "react";
import Goodby from "../../connectionMessage/Goodby/Goodby";
import Greeting from "../../connectionMessage/Greeting/Greeting";
import MessageItem from "../MessageItem/MessageItem";

function MessageList({ messages, sendReaction, username }) {
    return (
        <div className="messages">
            {messages.map((message) => 
                <div key={message.serverTime}>
                    {message.event === "connection" && (
                        <Greeting message={message} />
                    )}
                    {(message.event === "message" || message.event === 'changeReaction') && (
                        <MessageItem message={message} sendReaction={sendReaction} username={username} />
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
