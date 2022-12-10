import React from "react";

function MessageItem({ message, sendReaction, username }) {
    const {
        serverTime: timestamp,
        clientTime,
        username: messageAuthor,
    } = message;

    console.log(message.reactions);

    const messageReactionsCount = message.reactions.reduce((prev, curr) => {
        return curr.reaction ? ++prev : prev;
    }, 0);

    function isCurrUserReacted() {
        const currUserReacitonObj = message.reactions.find(
            (reactionObj) => reactionObj.username === username
        );

        if (!currUserReacitonObj) return false;

        return currUserReacitonObj.reaction;
    }

    const isUserReacted = isCurrUserReacted();

    const reactionClasses =
        "reaction " + (isUserReacted ? "reaction-bgcolor" : "");

    const date = new Date(timestamp);
    const time = date.getHours() + ":" + date.getMinutes();

    function handleClick() {
        sendReaction(clientTime);
    }

    return (
        <div className="message">
            <span>{message.username}: </span>
            <span>{message.text}</span>
            <span className={reactionClasses} onClick={handleClick}>
                {isUserReacted ? "❤️" : "♡"}{" "}
                {messageReactionsCount !== 0 ? messageReactionsCount : ""}
            </span>
            <span style={{ float: "right", marginRight: 10 }}>{time}</span>
        </div>
    );
}

export default MessageItem;
