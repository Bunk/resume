'use strict';

const Mongoose = require('mongoose');
const Joi = require('joi');
const EventEmitter = require('events').EventEmitter;

const internals = {
    log_info_tags: ['info', 'database', 'mongoose', 'mongodb'],
    log: (message, level, plugin) => {
        return plugin.log([level, 'database', 'mongoose', 'mongodb'], message);
    }
};

class MongooseConnector extends EventEmitter {
    constructor (options, plugin) {
        super();

        this.mongoose = Mongoose;
        this.connection = Mongoose.createConnection(options.uri);

        this.connection.on('connected', () => {
            internals.log('Connected', 'info', plugin);
            this.emit('ready');
        }).on('error', err => {
            internals.log(`Unable to connect to the database: ${err.message}`, 'error', plugin);
            this.emit('error', err);
        }).on('close', () => {
            internals.log('Connection to the database closed', 'info', plugin);
        }).on('disconnected', () => {
            internals.log('Disconnected from the database', 'warn', plugin);
            this.emit('disconnected');
        });
    }
}

module.exports = MongooseConnector;
