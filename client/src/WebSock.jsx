import React, { useRef, useState } from "react";
import LoginForm from "./components/auth/LoginForm/LoginForm";
import LogoutForm from "./components/auth/LogoutForm/LogoutForm";
import MessageForm from "./components/textMessage/MessageForm/MessageForm";
import MessageList from "./components/textMessage/MessageList/MessageList";
import StatusList from "./components/status/StatusList/StatusList";

function WebSock() {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState("");
    const [currWriters, setCurrWriters] = useState([]);
    const [isConnected, setConnected] = useState(false);
    const [username, setUsername] = useState("");
    const socket = useRef();

    function normalize(data) {
        data = JSON.parse(data);

        return data;
    }

    function setSortMessages(data) {
        setMessages((prev) => [...prev, data].sort((a, b) => a.serverTime - b.serverTime));
    }

    function startWrite(e) {
        setValue(e.target.value);

        if (!currWriters.find((writer) => writer.name === username)) {
            console.log("yes");
            sendStatus();
        }
    }

    async function sendMessage() {
        const message = {
            event: "message",
            username,
            clientTime: Date.now(),
            text: value,
        };

        socket.current.send(JSON.stringify(message));

        setValue("");
    }

    async function sendStatus() {
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
            const data = normalize(event.data);

            if (data.event === "changeStatus") {
                const { username: user, serverTime: time } = data;

                if (!currWriters.find((writer) => writer.name === user)) {
                    const newWriter = {
                        name: user,
                        clientTime: time,
                    };

                    setCurrWriters((writers) => [...writers, newWriter]);
                } else {
                    return;
                }

                setTimeout(() => {
                    setCurrWriters(() =>
                        currWriters.filter((writer) => writer.name !== user)
                    );
                }, 3000);
            }

            setSortMessages(data);
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
                <StatusList writers={currWriters} />
            </div>
        </div>
    );
}

export default WebSock;
