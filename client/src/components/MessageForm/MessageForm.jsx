import React from "react";

function MessageForm({value, startWrite, sendMessage}) {
    return (
        <div className="form">
            <input
                value={value}
                onChange={(e) => startWrite(e)}
                type="text"
                placeholder="Введите сообщение"
            />
            <button onClick={sendMessage}>Отправить</button>
        </div>
    );
}

export default MessageForm;
