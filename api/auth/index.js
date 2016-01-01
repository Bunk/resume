'use strict';

exports.register = function (server, options, next) {

    // Setup the session strategy
    server.auth.strategy('session', 'cookie', {
        password: options.session.password,
        redirectTo: '/auth/google',
        isSecure: false //Should be set to true (which is the default) in production
    });

    // Setup the Google login strategy
    server.auth.strategy('google', 'bell', {
        provider: 'google',
        password: options.session.password,
        clientId: options.oauth.google.clientId,
        clientSecret: options.oauth.google.clientSecret,
        isSecure: false //Should be set to true (which is the default) in production
    });

    server.route({
        method: 'GET',
        path: '/auth/google',
        config: {
            auth: 'google',
            handler: function (request, reply) {

                if (!request.auth.isAuthenticated) {
                    return reply(Boom.unauthorized('Authentication failed: ' + request.auth.error.message));
                }

                //Just store the third party credentials in the session as an example. You could do something
                //more useful here - like loading or setting up an account (social signup).
                request.auth.session.set(request.auth.credentials);

                return reply(request.auth.credentials);
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/profiles/me',
        config: {
            auth: 'session',
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
    dependencies: ['hapi-auth-cookie', 'bell']
};
