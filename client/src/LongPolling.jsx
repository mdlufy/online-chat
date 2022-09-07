import React, { useEffect, useState } from "react";
import axios from "axios";

function LongPolling() {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');

    useEffect(() => {
        subscribe();
    }, [])

    async function subscribe() {
        try {
            const {data} = await axios.get('http://localhost:5000/get-messages');

            setMessages(prev => [data, ...prev]);

            await subscribe();
        } catch (e) {
            setTimeout(() => {
                subscribe();
            }, 500)
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
