import React, { useRef, useState } from "react";
import LoginForm from "./components/auth/LoginForm/LoginForm";
import LogoutForm from "./components/auth/LogoutForm/LogoutForm";
import MessageForm from "./components/textMessage/MessageForm/MessageForm";
import MessageList from "./components/textMessage/MessageList/MessageList";
import StatusItem from "./components/StatusItem/StatusItem";

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
        }, 1000);
    }

    function sendMessage() {
        const message = {
            event: "message",
            username,
            clientTime: Date.now(),
            text: value,
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

    function connect() {
        socket.current = new WebSocket("ws://localhost:5000");

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

            data.event === "changeStatus"
                ? changeStatus(data)
                : setSortMessages(data);
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
                <LogoutForm disconnect={disconnect} />
                <MessageForm
                    value={value}
                    startWrite={startWrite}
                    sendMessage={sendMessage}
                />
                <MessageList messages={messages} />
                <StatusItem isWriting={isWriting} writer={writer} />
            </div>
        </div>
    );
}

export default WebSock;
