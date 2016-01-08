module.exports = {
    // Server
    port: process.env.API_PORT || 3000,

    // Services
    rabbitUrl: process.env.RABBIT_URL || 'amqp://admin:password@docker',
    mongoUrl: process.env.MONGO_URL || 'mongodb://docker',

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
