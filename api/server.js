'use strict';

const Hapi = require('hapi');
const Package = require('./package.json');

let config = {
    port: 3000,
    plugins: [{
        register: require('./resumes/routes')
    }, {
        register: require('./conversions/routes')
    }, {
        register: require('./formats/routes')
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
        response: {emptyStatusCode: 204}
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
