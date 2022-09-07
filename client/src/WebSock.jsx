import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

function WebSock(props) {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
    const socket = useRef();
    const [isConnected, setConnected] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        socket.current = new WebSocket('ws://localhost:5000');

        socket.current.onopen = () => {
            setConnected(true);
        }

        socket.current.onmessage = () => {

        }

        socket.current.onclose = () => {
            console.log('Socket закрыт');
        }

        socket.current.onerror = () => {
            console.log('Socket произошла ошибка');
        }
    }, [])

    async function sendMessage() {
        await axios.post('http://localhost:5000/new-messages', {
            id: Date.now(),
            messageText: value,
        })
    }

    if (!isConnected) {
        return (
            <div className='center'>
                <div className='form'>
                    <input 
                        value={username} 
                        onChange={e => setUsername(e.target.value)} 
                        type='text' 
                        placeholder='Введите ваше имя'
                    />
                    <button>Войти</button>
                </div>
            </div>
        )
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

export default WebSock;