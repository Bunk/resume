module.exports = {
    // Services
    rabbitUrl   : process.env.RABBIT_URL || 'amqp://admin:password@docker',
    mongoUrl    : process.env.MONGO_URL || 'mongodb://admin:password@docker'
};
