'use strict';

let shortid = require('shortid');

let topics = {};

class Subscription {
    constructor (topic, listener) {
        this.topic = topic;
        this.listener = listener;
    }

    unsubscribe () {
        delete topic[this];
    }
}

class Messaging {
    constructor () {
        // queues are shared
        this.topics = topics;
    }

    subscribe (topic, listener) {
        if (!this.topics[topic]) {
            this.topics[topic] = {};
        }

        let sub = new Subscription(this.topics[topic]);
        return this.topics[topic][sub] = sub;
    }

    publish (topic, data) {
        let arr = [];
        let subs = this.topics[topic];
        Object.keys(subs).forEach((key) => {
            subs[key].listener(data);
        });
    }
}

module.exports = Messaging;
