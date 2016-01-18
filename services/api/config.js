module.exports = {
    // Server
    port: process.env.API_PORT || 3000,

    // Services
    messaging: {
        user: process.env.RABBIT_USER || 'admin',
        password: process.env.RABBIT_PASSWORD || 'password',
        server: process.env.RABBIT_SERVER || 'docker',
        conversionExchange: 'conversion',
        conversionQueue: 'conversion.run'
    },
    mongo: {
        server: process.env.MONGO_SERVER || 'docker'
    },

    resumesUrl: process.env.API_RESUMES_URL || 'http://docker:3000/resumes',
    templatesUrl: process.env.API_TEMPLATES_URL || 'http://docker:3000/templates',

    // Security
    jwt: {
        secret: process.env.JWT_SECRET || 'secret'
    },
    session: {
        password: process.env.SESSION_SALT || 'secret'
    },
    oauth: {
        google: {
            clientId: process.env.OAUTH_GOOGLE_CLIENTID || 'MUST_CHANGE',
            clientSecret: process.env.OAUTH_GOOGLE_CLIENTSECRET || 'MUST_CHANGE'
        }
    }
};
