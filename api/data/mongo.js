'use strict';

const Hoek = require('hoek');
const MongooseConnector = require('./mongoose');

const internals = {
    defaults: {
        uri: 'mongodb://127.0.0.1:27017'
    }
};

exports.register = (server, options, next) => {
    const settings = Hoek.applyToDefaults(internals.defaults, options);

    let connector = new MongooseConnector(settings, server);
    let connection = connector.connection;

    connector.on('ready', () => {
        let getConnection = () => connection;
        let getMongoose = () => connector.mongoose;

        server.method('mongoose', getMongoose, {});
        server.method('mongooseDb', getConnection, {});

        console.log('server methods added');

        next();
    });

    connector.on('error', err => {
        next(err);
    });
};

exports.register.attributes = {
    name: 'hapi-mongo',
    version: '0.0.1'
};
