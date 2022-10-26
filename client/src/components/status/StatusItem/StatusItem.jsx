import React from "react";

function StatusItem({ writer }) {
    return (
        <div style={{'marginTop': '10px'}}>
            {writer.name} печатает...
        </div>
    );
}

export default StatusItem;
