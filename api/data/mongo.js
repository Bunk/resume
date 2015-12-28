'use strict';

const Hoek = require('hoek');
const Mongoose = require('mongoose');

const internals = {
    defaults: {
        server: { uri: 'mongodb://127.0.0.1:27017' },
        options: { }
    }
};

exports.register = (server, options, next) => {
    const settings  = Hoek.applyToDefaults(internals.defaults, options);

    Mongoose.Promise = global.Promise;
    Mongoose.connect(settings.uri, settings.options);

    server.method('mongoose', () => Mongoose, {});

    next();
};

exports.register.attributes = {
    name: 'hapi-mongo',
    version: '0.0.1'
};
