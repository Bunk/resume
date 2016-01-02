'use strict';

const co = require('co');
const AuthController = require('./controller');

exports.register = function (server, options, next) {

    let controller = new AuthController(options);
    server.bind(controller);

    // Setup the Google login strategy
    server.auth.strategy('google', 'bell', {
        provider: 'google',
        password: options.session.password,
        clientId: options.oauth.google.clientId,
        clientSecret: options.oauth.google.clientSecret,
        isSecure: false //Should be set to true (which is the default) in production
    });

    // Main bearer token implementation
    server.auth.strategy('bearer', 'jwt', {
        key: options.jwt.secret,
        validateFunc: controller.validateToken,
        verifyOptions: {
            algorithms: [ 'HS256' ]
        }
    });
    server.auth.default('bearer');

    server.route({
        method: 'GET',
        path: '/auth/google',
        config: {
            auth: 'google',
            handler: {
                async: co.wrap(controller.authorizeGoogle)
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/profiles/me',
        config: {
            handler: (request, reply) => {
                return reply(request.auth.credentials.profile);
            }
        }
    });

    next();
};

exports.register.attributes = {
    name: 'auth',
    version: '0.0.1',
    dependencies: ['hapi-auth-jwt2', 'bell']
};
