import React, { useRef, useState } from 'react';
import axios from 'axios';

function WebSock() {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
    const socket = useRef();
    const [isConnected, setConnected] = useState(false);
    const [username, setUsername] = useState('');


    async function sendMessage() {
        await axios.post('http://localhost:5000/new-messages', {
            id: Date.now(),
            messageText: value,
        })
    }

    function connect() {
        socket.current = new WebSocket('ws://localhost:5000');

        socket.current.onopen = () => {
            setConnected(true);

            const message = {
                event: 'connection',
                username,
                id: Date.now(),
            }

            socket.current.send(JSON.stringify(message));
        }

        socket.current.onmessage = (event) => {
            const response = event.data;
            const data = JSON.parse(response);

            setMessages(prev => [data, ...prev]);
        }

        socket.current.onclose = () => {
            console.log('Socket закрыт');
        }

        socket.current.onerror = () => {
            console.log('Socket произошла ошибка');
        }
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
                    <button onClick={connect}>Войти</button>
                </div>
            </div>
        )
    }

    return (
        <div className="center">
            <div>
                <div className="form">
                    <input value={value} onChange={e => setValue(e.target.value)} type="text" placeholder="Введите сообщение" />
                    <button onClick={sendMessage}>Отправить</button>
                </div>
                <div className="messages">
                    {messages.map(message => 
                        <div key={message.id}>
                            {message.event === 'connection'
                                ? <div className='connection_message'>
                                    Пользователь {message.username} подключился
                                </div>
                                : <div className='message'>
                                    {message.username}: {message.messageText}
                                </div>
                            }
                        </div>     
                    )}
                </div>
            </div>
        </div>
    );
}

export default WebSock;