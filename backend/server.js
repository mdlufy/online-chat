const ws = require("ws");
const Queue = require("./utils/Queue");

const PORT = process.env.PORT || 3000;

const wsServer = new ws.WebSocketServer(
    {
        port: PORT,
    },
    () => console.log(`Server started on port 3000`)
);

const queue = new Queue();
let writeToQueue = false;

wsServer.on("connection", (ws, req) => {
    const ip = req.socket.remoteAddress;
    console.log(`Connected ${ip}`);

    ws.on("message", (data) => {
        console.log(`received: ${data}`);

        data = normalize(data);

        wsServer.clients.size === 1 ? startWriteToQueue() : stopWriteToQueue();

        switch (data.event) {
            case "connection":
                addMessageToQueue(data, queue);

                broadcastMessage(data);
                broadcastMissedMessages(queue, ws);
                break;
            case "message":
                addMessageToQueue(data, queue);

                broadcastMessage(data);
                break;
            case "changeStatus":
                broadcastStatus(data, ws);
                break;
            case "changeReaction":
                broadcastReaction(data);
                break;
            case "disconnect":
                startWriteToQueue();

                addMessageToQueue(data, queue);

                broadcastMessage(data);
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

function broadcastReaction(message) {
    wsServer.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

function broadcastMissedMessages(queue, currWs) {
    if (wsServer.clients.size === 1) return;

    console.log("start sync");

    wsServer.clients.forEach((client) => {
        if (client === currWs && client.readyState === ws.OPEN) {
            while (queue.size) {
                const message = queue.dequeue();

                client.send(JSON.stringify(message));

                console.log(`message to sync: ${JSON.stringify(message)}`);
            }

            stopWriteToQueue();
        }
    });

    console.log("end sync");
}

function broadcastError(currWs) {
    const error = new Error("Bad query");

    currWs.send(error.message);
}

function writeServerTime(data) {
    return {
        ...data,
        serverTime: Date.now(),
    };
}

function sortByServerTime(data) {
    return data.sort((a, b) => a.serverTime - b.serverTime);
}

function normalize(data) {
    data = JSON.parse(data);
    data = writeServerTime(data);

    return data;
}

function startWriteToQueue() {
    writeToQueue = true;
}

function stopWriteToQueue() {
    writeToQueue = false;
}

function addMessageToQueue(data, queue) {
    if (!writeToQueue) return;

    queue.enqueue(data);

    sortByServerTime(queue.getQueue);

    console.log(queue);
}
