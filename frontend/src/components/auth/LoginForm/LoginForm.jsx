import React from "react";

function LoginForm({username, setUsername, connect}) {
    function handleKeyDown(e) {
        if (e.key === "Enter") {
            connect();
        }
    }

    return (
        <div className="center">
            <div className="form">
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e)}
                    type="text"
                    placeholder="Введите ваше имя"
                />
                <button onClick={connect}>Подключиться</button>
            </div>
        </div>
    );
}

export default LoginForm;
