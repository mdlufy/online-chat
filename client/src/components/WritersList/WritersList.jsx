import React from "react";

function WritersList({writers}) {
    return (
        <div className="writers">
            {writers.map((writer) => (
                <div key={writer.id}>
                    <div>{writer.name} печатает...</div>
                </div>
            ))}
        </div>
    );
}

export default WritersList;
