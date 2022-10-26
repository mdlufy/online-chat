const ws = require("ws");

const wsServer = new ws.WebSocketServer(
    {
        port: 5000,
    },
    () => console.log(`Server started on port 5000`)
);

const cache = [];
let clientDisconnectTime = null;

wsServer.on("connection", (ws, req) => {
    const ip = req.socket.remoteAddress;
    console.log(`Connected ${ip}`);

    ws.on("message", (data) => {
        console.log(`received: ${data}`);

        data = JSON.parse(data);

        switch (data.event) {
            case "connection":
                broadcastMessage(data);
                broadcastMissedMessages(cache, ws, clientDisconnectTime);
                break;
            case "message":
                broadcastMessage(data);

                cache.push(data);
                break;
            case "changeStatus":
                broadcastStatus(data, ws);
                break;
            case "disconnect":
                broadcastMessage(data);
                clientDisconnectTime = getTime(data);
                break;
            default:
                broadcastError(ws);
        }
    });

    ws.on("close", () => {
        console.log(`Disconnected ${ip}`);
    });
});

function broadcastMessage(message) {
    wsServer.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

function broadcastStatus(message, currWs) {
    wsServer.clients.forEach((client) => {
        if (client !== currWs && client.readyState === ws.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

function broadcastError(currWs) {
    const error = new Error("Bad query");

    currWs.send(error.message);
}

function getTime(data) {
    const { time: timestamp } = data;

    return timestamp;
}

function broadcastMissedMessages(cache, currWs, clientDisconnectTime) {
    if (clientDisconnectTime === null) return;

    console.log("start sync");
    wsServer.clients.forEach((client) => {
        if (client === currWs && client.readyState === ws.OPEN) {
            for (const message of cache) {
                const time = message.time;

                if (time > clientDisconnectTime) {
                    client.send(JSON.stringify(message));
                }
            }
        }
    });

    console.log("end sync");
}
