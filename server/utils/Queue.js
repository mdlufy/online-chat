module.exports = class Queue {
    constructor() {
        this.queue = [];
    }

    enqueue(item) {
        this.queue.push(item);
    }

    dequeue() {
        return this.queue.shift();
    }

    clean() {
        this.queue = [];
    }

    get getQueue() {
        return this.queue;
    }

    get size() {
        return this.queue.length;
    }
}