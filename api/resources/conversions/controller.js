'use strict';

const Shortid = require('shortid');
const Boom = require('boom');

const internals = {
    queue: {
        key: 'conversion_queue',
        persistent: true
    }
};

class ConversionController {

    constructor (exchange, mongoose) {
        this.exchange = exchange;
        this.queue = exchange.queue({
            name: internals.queue.key,
            durable: true
        });
        this.mongoose = mongoose;
    }

    start (request, reply) {        
        let id = Shortid.generate();
        let msg = {
            id,
            resume: {
                id: request.payload.resumeId,
                format: 'md'
            },
            template: {
                id: request.payload.templateId
            },
            format: request.payload.format
        };

        this.exchange.publish(msg, internals.queue);

        return reply({ id });
    }

    abort (request, reply) {
        return reply('conversion aborted');
    }

    view (request, reply) {
        return reply({ id: request.params.id });
    }
};

module.exports = ConversionController;
