import React from "react";

function LogoutForm({ disconnect }) {
    return (
        <div className="logout">
            <button onClick={disconnect}>Отключиться</button>
        </div>
    );
}

export default LogoutForm;
