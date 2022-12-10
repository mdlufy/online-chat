import React, { useRef, useState } from "react";
import LoginForm from "./components/auth/LoginForm/LoginForm";
import MessageForm from "./components/textMessage/MessageForm/MessageForm";
import MessageList from "./components/textMessage/MessageList/MessageList";
import StatusItem from "./components/StatusItem/StatusItem";
import ProfileForm from "./components/auth/ProfileForm/ProfileForm";

function WebSock() {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState("");
    const [writer, setWriter] = useState({});
    const [isConnected, setConnected] = useState(false);
    const [isWriting, setIsWriting] = useState(false);
    const [username, setUsername] = useState("");
    const socket = useRef();

    let timeoutId = null;

    function setSortMessages(data) {
        setMessages((prev) =>
            [...prev, data].sort((a, b) => a.serverTime - b.serverTime)
        );
    }

    function startWrite(e) {
        setValue(e.target.value);

        sendStatus();
    }

    function changeStatus(data) {
        const { username: user, serverTime } = data;

        clearTimeout(timeoutId);

        setIsWriting(true);

        setWriter(() => ({ name: user, serverTime }));

        timeoutId = setTimeout(() => {
            setIsWriting(false);
        }, 1500);
    }

    function changeReaction({ clientTime, reactionAuthor }) {
        setMessages((messages) => {
            const message = messages.find(
                (message) => message.clientTime === clientTime
            );

            const isReactionAuthorInReactionsArray = message.reactions.find(
                (reactionObj) => reactionObj.username === reactionAuthor
            );

            const newReactions = isReactionAuthorInReactionsArray
                ? [
                      ...message.reactions.map((reactionObj) => {
                          return reactionObj.username === reactionAuthor
                              ? {
                                    ...reactionObj,
                                    reaction: !reactionObj.reaction,
                                }
                              : reactionObj;
                      }),
                  ]
                : [
                      ...message.reactions,
                      { username: reactionAuthor, reaction: true },
                  ];

            message.reactions = newReactions;

            const newMessagesArray = [
                ...messages.filter(
                    (message) => message.clientTime !== clientTime
                ),
                message,
            ];

            newMessagesArray.sort((a, b) => a.serverTime - b.serverTime);

            return newMessagesArray;
        });
    }

    function sendMessage() {
        const message = {
            event: "message",
            username,
            clientTime: Date.now(),
            text: value,
            reactions: [{ username: username, reaction: false }],

            // reaction format
            /*
                {
                    username: string;
                    reaction: boolean;
                },
            */
        };

        socket.current.send(JSON.stringify(message));

        setValue("");
    }

    function sendStatus() {
        const status = {
            event: "changeStatus",
            username,
            clientTime: Date.now(),
        };

        socket.current.send(JSON.stringify(status));
    }

    function sendReaction(clientTime) {
        const status = {
            event: "changeReaction",
            clientTime: clientTime,
            reactionAuthor: username,
        };

        socket.current.send(JSON.stringify(status));
    }

    function connect() {
        const HOST =
            window.location.protocol === "https:"
                ? "wss://ws-online-chat.herokuapp.com"
                : "ws://localhost:3000";

        socket.current = new WebSocket(HOST);

        socket.current.onopen = () => {
            setConnected(true);

            const message = {
                event: "connection",
                username,
                clientTime: Date.now(),
            };

            socket.current.send(JSON.stringify(message));
        };

        socket.current.onmessage = (event) => {
            const data = JSON.parse(event.data);

            switch (data.event) {
                case "changeStatus":
                    changeStatus(data);
                    break;
                case "changeReaction":
                    changeReaction(data);
                    break;
                default:
                    setSortMessages(data);
            }
        };

        socket.current.onclose = () => {
            setConnected(false);

            console.log("Socket закрыт");
        };

        socket.current.onerror = () => {
            console.log("Socket произошла ошибка");
        };
    }

    function disconnect() {
        const message = {
            event: "disconnect",
            username,
            clientTime: Date.now(),
        };

        socket.current.send(JSON.stringify(message));

        socket.current.close();
    }

    if (!isConnected) {
        return (
            <LoginForm
                username={username}
                setUsername={setUsername}
                connect={connect}
            />
        );
    }

    return (
        <div className="center">
            <div>
                <ProfileForm username={username} disconnect={disconnect} />
                <MessageForm
                    value={value}
                    startWrite={startWrite}
                    sendMessage={sendMessage}
                />
                <MessageList
                    messages={messages}
                    sendReaction={sendReaction}
                    username={username}
                />
                <StatusItem isWriting={isWriting} writer={writer} />
            </div>
        </div>
    );
}

export default WebSock;
