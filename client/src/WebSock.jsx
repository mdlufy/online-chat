import React, { useRef, useState } from "react";

function WebSock() {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState("");
    const socket = useRef();
    const [currWriters, setCurrWriters] = useState([]);
    const [isConnected, setConnected] = useState(false);
    const [username, setUsername] = useState("");

    async function sendMessage() {
        const message = {
            username,
            text: value,
            id: Date.now(),
            event: "message",
        };

        socket.current.send(JSON.stringify(message));

        setValue("");
    }

    async function sendStatus() {
        const status = {
            username,
            id: Date.now(),
            event: "changeStatus",
        };

        socket.current.send(JSON.stringify(status));
    }

    function startWrite(e) {
        setValue(e.target.value);

        if (currWriters.includes(username)) {
            e.stopPropagation();
        } else {
            sendStatus();
        }
    }

    function connect() {
        socket.current = new WebSocket("ws://localhost:5000");

        socket.current.onopen = () => {
            setConnected(true);

            const message = {
                event: "connection",
                username,
                id: Date.now(),
            };

            socket.current.send(JSON.stringify(message));
        };

        socket.current.onmessage = (event) => {
            const response = event.data;
            const data = JSON.parse(response);

            if (data.event === "changeStatus") {
                if (!currWriters.includes(data.username)) {
                    setCurrWriters((writers) => [...writers, data.username]);
                }

                setTimeout(() => {
                    setCurrWriters((writers) =>
                        writers.filter((name) => name !== data.username)
                    );
                }, 2000);
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
            <div className="center">
                <div className="form">
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                        placeholder="Введите ваше имя"
                    />
                    <button onClick={connect}>Войти</button>
                </div>
            </div>
        );
    }

    return (
        <div className="center">
            <div>
                <div className="form">
                    <input
                        value={value}
                        onChange={(e) => startWrite(e)}
                        on
                        type="text"
                        placeholder="Введите сообщение"
                    />
                    <button onClick={sendMessage}>Отправить</button>
                </div>
                <div className="messages">
                    {messages.map((message) => (
                        <div key={message.id}>
                            {message.event === "connection" && (
                                <div className="connection_message">
                                    Пользователь {message.username} подключился
                                </div>
                            )}
                            {message.event === "message" && (
                                <div className="message">
                                    {message.username}: {message.text}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div>
                    {currWriters.map((writer) => (
                        <div key={writer.id}>
                            <div>{writer} печатает...</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default WebSock;