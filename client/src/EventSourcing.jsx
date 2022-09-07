import React, { useEffect, useState } from "react";
import axios from "axios";

function LongPolling() {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');

    useEffect(() => {
        subscribe();
    }, [])

    async function subscribe() {
       const eventSource = new EventSource('http://localhost:5000/connect');

       eventSource.onmessage = function (event) {
           console.log(event.data);
       }
    }

    async function sendMessage() {
        await axios.post('http://localhost:5000/new-messages', {
            id: Date.now(),
            messageText: value,
        })
    }

    return (
        <div className="center">
            <div>
                <div className="form">
                    <input value={value} onChange={e => setValue(e.target.value)} type="text" />
                    <button onClick={sendMessage}>Отправить</button>
                </div>
                <div className="messages">
                    {messages.map(message => 
                        <div className="message" key={message.id}>
                            {message.messageText}
                        </div>     
                    )}
                </div>
            </div>
        </div>
    );
}

export default LongPolling;
