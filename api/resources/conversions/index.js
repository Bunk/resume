'use strict';

const co = require('co');
const Joi = require('joi');
const JackRabbit = require('jackrabbit');
const Mongoose = require('mongoose');
const Controller = require('./controller');

exports.register = function (server, options, next) {
    let rabbit = JackRabbit(options.rabbitUrl);
    let controller = new Controller(options, rabbit.default());
    server.bind(controller);

    // /conversions
    //      POST    - Create a new translation task for a given resume
    // /conversions/{id}
    //      GET     - Representation of the async conversion task
    //      DELETE  - Cancels the async conversion task

    let validations = {
        id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
        format: Joi.string().valid(['html', 'pdf', 'md']).insensitive(),
        status: Joi.string().valid(['requested', 'running', 'aborted', 'complete']).insensitive()
    };

    server.route([{
        method: 'POST',
        path: '/conversions',
        config: {
            id: 'convert',
            handler: {
                async: co.wrap(controller.start)
            },
            validate: {
                payload: Joi.object().keys({
                    resumeId: validations.id.required(),
                    //templateId: validations.id,
                    format: validations.format.required()
                })
            }
        }
    }, {
        method: 'GET',
        path: '/conversions/{id}',
        config: {
            id: 'conversion',
            handler: {
                async: co.wrap(controller.view)
            },
            validate: {
                params: {
                    id: validations.id
                }
            }
        }
    }, {
        method: 'PUT',
        path: '/conversions/{id}',
        config: {
            handler: {
                async: co.wrap(controller.update)
            },
            validate: {
                params: {
                    id: validations.id
                },
                payload: Joi.object().keys({
                    id: validations.id,
                    resume: validations.id,
                    inputFormat: validations.format.required(),
                    outputFormat: validations.format.required(),
                    status: validations.status.required()
                })
            }
        }
    }, {
        method: 'DELETE',
        path: '/conversions/{id}',
        config: {
            handler: {
                async: co.wrap(controller.abort)
            },
            validate: {
                params: {
                    id: validations.id
                }
            }
        }
    }]);

    next();
};

exports.register.attributes = {
    name: 'routes-translations',
    version: '0.0.1'
};
