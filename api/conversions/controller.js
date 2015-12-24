'use strict';

const Shortid = require('shortid');
const Boom = require('boom');
const Messaging = require('../messaging');

class ConversionController {
    start (request, reply) {
        return reply();
    }

    abort (request, reply) {
        return reply('conversion aborted');
    }

    view (request, reply) {
        return reply({ id: request.params.id });
    }
}

module.exports = ConversionController;
