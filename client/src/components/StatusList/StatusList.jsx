import React from "react";
import StatusItem from "../StatusItem/StatusItem";

function StatusList({ writers }) {
    return (
        <div className="writers">
            {writers.map((writer) => (
                <div key={writer.time}>
                    <StatusItem writer={writer}/>
                </div>
            ))}
        </div>
    );
}

export default StatusList;
