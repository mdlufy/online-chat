import React, { useRef, useState } from "react";
import LoginForm from "./components/LoginForm/LoginForm";
import MessageForm from "./components/MessageForm/MessageForm";
import MessageList from "./components/MessageList/MessageList";
import StatusList from "./components/StatusList/StatusList";

function WebSock() {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState("");
    const [currWriters, setCurrWriters] = useState([]);
    const [isConnected, setConnected] = useState(false);
    const [username, setUsername] = useState("");
    const socket = useRef();


    function startWrite(e) {
        setValue(e.target.value);

        if (!currWriters.find(writer => writer.name === username)) {
            sendStatus();
        }
    }

    async function sendMessage() {
        const message = {
            username,
            text: value,
            time: Date.now(),
            event: "message",
        };

        socket.current.send(JSON.stringify(message));

        setValue("");
    }

    async function sendStatus() {
        const status = {
            username,
            time: Date.now(),
            event: "changeStatus",
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
                time: Date.now(),
            };

            socket.current.send(JSON.stringify(message));
        };

        socket.current.onmessage = (event) => {
            const response = event.data;
            const data = JSON.parse(response);

            if (data.event === "changeStatus") {
                const { username: user, time } = data;

                if (!currWriters.find((writer) => writer.name === user)) {
                    const newWriter = {
                        name: user,
                        time: time,
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

            setMessages((prev) => [...prev, data]);
        };

        socket.current.onclose = () => {
            console.log("Socket закрыт");
        };

        socket.current.onerror = () => {
            console.log("Socket произошла ошибка");
        };
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
