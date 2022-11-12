import React from "react";

function MessageForm({value, startWrite, sendMessage}) {
    function handleKeyDown(e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    }

    return (
        <div className="form">
            <input
                value={value}
                onChange={(e) => startWrite(e)}
                onKeyDown={(e) => handleKeyDown(e)}
                type="text"
                placeholder="Введите сообщение"
            />
            <button onClick={sendMessage}>Отправить</button>
        </div>
    );
}

export default MessageForm;
