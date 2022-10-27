import React from "react";

function StatusItem({ writer }) {
    return (
        <div className="writing_status">
            {writer.name} печатает...
        </div>
    );
}

export default StatusItem;
