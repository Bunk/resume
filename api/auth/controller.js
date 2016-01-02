'use strict';

const UUID = require('node-uuid');
const JWT = require('jsonwebtoken');

class AuthController {
    constructor (options) {
        this.jwtSecret = options.jwt.secret;
    }

    * validateToken (decoded, request, callback) {
        // TODO: Database lookup to enable revocation of tokens
        return callback(null, true); // success
    }

    * authorizeGoogle (request, reply) {
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
            iat: now,                  // Issuance date
            exp: now + 30 * 60 * 1000, // Expires in 30 minutes
            sub: profile.id,
            scopes: {
                resumes: {
                    actions: ['read', 'create']
                }
            },
            profile: {
                name: profile.displayName,
                email: profile.emails[0].value
            }
        };

        let token = JWT.sign(session, this.jwtSecret);

        return reply({ token: token })
            .header('Authorization', `Bearer ${token}`);
    }
}

module.exports = AuthController;
