'use strict';

const Hapi = require('hapi');
const Package = require('./package.json');
const Config = require('./config');

let config = {
    port: 3000,
    plugins: [{
        register: require('hapi-async-handler')
    }, {
        register: require('./resources/resumes/routes'),
        options: Config
    }, {
        register: require('./resources/conversions/routes'),
        options: Config
    }, {
        register: require('./resources/formats/routes'),
        options: Config
    }, {
        register: require('./data/mongo'),
        options: { uri: Config.mongoUrl }
    }, {
        register: require('hapi-to')
    }]
};

let server = new Hapi.Server({
    debug: {request: ['info', 'error']}
});

server.connection({
    port : config.port,
    routes: {
        response: { emptyStatusCode: 204 }
    }
});

server.register(config.plugins, (err) => {
    if (err) { throw err; }

    if (!module.parent) {
        server.start((err) => {
            if (err) { throw err; }

            server.log('info', `Running [${Package.name}] at [${server.info.uri}]`);
        });
    }
});
