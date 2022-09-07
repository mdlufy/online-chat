import React, { useState } from "react";
import axios from "axios";

function LongPolling(props) {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');

    async function sendMessage() {
        await axios.post('http://localhost:5000/new-messages', {
            id: Date.now(),
            message: value,
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
                            {message.value}
                        </div>     
                    )}
                </div>
            </div>
        </div>
    );
}

export default LongPolling;
