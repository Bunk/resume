'use strict';

const Boom = require('boom');
const Models = require('../../data/models');
const Resume = Models.Resume;
const Template = Models.Template;
const Conversion = Models.Conversion;

const internals = {
    queue: {
        key: 'conversion_queue',
        persistent: true
    }
};

class ConversionController {

    constructor (config, exchange) {
        this.exchange = exchange;
        this.queue = exchange.queue({
            name: internals.queue.key,
            durable: true
        });
    }

    * start (request, reply) {
        // Pull info from template and resume services
        // TODO: Separate these API's into microservices for funsies
        var resume = yield Resume.findById(request.payload.resumeId).lean().exec();
        if (!resume) {
            return reply(Boom.badData('Invalid resume identifier'));
        }

        var template = yield Resume.findById(request.payload.templateId).lean().exec();
        if (!template) {
            return reply(Boom.badData('Invalid template identifier'));
        }

        let conversion = new Conversion({
            resume: resume,
            template: template,
            outputFormat: request.payload.format
        });
        conversion.save((err, doc) => {
            if (err) {
                return reply(err);
            }

            this.exchange.publish({
                id: conversion._id,
                content: resume.content,
                contentFormat: resume.format,
                outputFormat: request.payload.format
            }, internals.queue);

            return reply({ doc });
        });
    }

    abort (request, reply) {
        return reply('conversion aborted');
    }

    view (request, reply) {
        return reply({ id: request.params.id });
    }
};

module.exports = ConversionController;
