'use strict';

const ShortId = require('shortid');
const JackRabbit = require('jackrabbit');
const Hoek = require('hoek');
const Joi = require('joi');

module.exports.register = (plugin, userOptions, next) => {
    let defaultOptions = {
        uri : process.env.RABBIT_URL || 'amqp://resume'
    };

    let opt = Hoek.applyToDefaults(defaultOptions, userOptions);

};
