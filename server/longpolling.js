const express = require('express');
const cors = require('cors');
const event = require('events');

const PORT = 5000;

const emitter = new event.EventEmitter();

const app = express();

app.use(cors())

app.get('/get-messages', ((req, res) => {
    emitter.once('newMessage', (message) => {
        res.json(message);
    })
}))

app.post('/new-messages', ((req, res) => {
    const message = req.body;

    emitter.emit('newMessages', message);

    res.status(200)
}))

app.listen(PORT, () => console.log(`server started on port ${PORT}`))