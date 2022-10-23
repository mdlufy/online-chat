import React from "react";

function LoginForm({username, setUsername, connect}) {
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

export default LoginForm;
