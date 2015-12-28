module.exports = {
    // Services
    rabbitUrl   : process.env.RABBIT_URL || 'amqp://admin:password@docker',
    mongoUrl    : process.env.MONGO_URL || 'mongodb://admin:password@docker',

    resumesUrl   : process.env.API_RESUMES_URL || 'http://docker:3000/resumes',
    templatesUrl : process.env.API_TEMPLATES_URL || 'http://docker:3000/templates'
};
