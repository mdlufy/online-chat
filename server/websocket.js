const ws = require('ws');

const wsServer = new ws.Server({
    port: 5000,

}, () => console.log(`Server started on port 5000`));



wsServer.on('connection', function connection(ws) {
    ws.on('message', function (message) {
        message = JSON.parse(message);

        switch (message.event) {
            case 'message': 
                broadcastMessage(message);
                break;
            case 'connection': 
                broadcastMessage(message);
                break;
            case 'changeStatus':
                broadcastMessage(message);
                break;
            default: 
                ws.send((new Error("Bad query")).message)
        }
    })
});


function broadcastMessage(message) {
    wsServer.clients.forEach(client => {
        client.send(JSON.stringify(message));
    })
}