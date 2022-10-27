import React from "react";

function StatusItem({ isWriting, writer }) {
    return (
        <>
            {isWriting && (
                <div className="writing_status">{writer.name} печатает...</div>
            )}
        </>
    );
}

export default StatusItem;
