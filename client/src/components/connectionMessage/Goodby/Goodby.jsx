import React from "react";

function Goodby({ message }) {
    return (
        <div className="connection_status">
            Пользователь {message.username} отключился
        </div>
    );
}
export default Goodby;
