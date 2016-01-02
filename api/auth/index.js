'use strict';

const UUID = require('node-uuid');
const JWT = require('jsonwebtoken');

exports.register = function (server, options, next) {

    server.auth.strategy('jwt', 'jwt', {
        key: options.jwt.secret,
        validateFunc: (decoded, request, callback) => {
            // TODO: Database lookup to enable revocation of tokens
            return callback(null, true); // success
        },
        verifyOptions: {
            algorithms: [ 'HS256' ]
        }
    });

    // Setup the Google login strategy
    server.auth.strategy('google', 'bell', {
        provider: 'google',
        password: options.session.password,
        clientId: options.oauth.google.clientId,
        clientSecret: options.oauth.google.clientSecret,
        isSecure: false //Should be set to true (which is the default) in production
    });

    server.auth.default('jwt');

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
                //request.auth.session.set(request.auth.credentials);

                let now = new Date().getTime();
                let profile = request.auth.credentials.profile;
                let session = {
                    jti: UUID.v4(),
                    iat: now,                       // Issuance date
                    exp: now + 24 * 60 * 60 * 1000, // Expires in 1 day
                    scopes: {
                        resumes: {
                            actions: ['read', 'create']
                        },
                        conversions: {
                            actions: ['read', 'create']
                        },
                        templates: {
                            actions: ['read', 'create']
                        }
                    },
                    profile: {
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        avatar: profile.raw.image
                    }
                };

                // sign the session as a JWT
                let token = JWT.sign(session, options.jwt.secret); // synchronous
                console.log(token);

                return reply({ token: token }).header('Authorization', `Bearer ${token}`);
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
    dependencies: ['hapi-auth-cookie', 'hapi-auth-jwt2', 'bell']
};
