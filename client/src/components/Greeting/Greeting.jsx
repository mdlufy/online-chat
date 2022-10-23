import React from "react";

function Greeting({message}) {
    return (
        <div className="connection_message">
            Пользователь {message.username} подключился
        </div>
    );
}

export default Greeting;
