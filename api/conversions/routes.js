'use strict';

const Joi = require('joi');
const Controller = require('./controller');

exports.register = function (server, options, next) {
    let controller = new Controller(options);

    // /conversions
    //      POST    - Create a new translation task for a given resume
    // /conversions/{id}
    //      GET     - Representation of the async conversion task
    //      DELETE  - Cancels the async conversion task

    let validations = {
        id: Joi.string().regex(/^[a-zA-Z0-9_-]{7,14}$/),
        format: Joi.string().valid(['html', 'pdf', 'md']).insensitive()
    };

    server.route([{
        method: 'POST',
        path: '/conversions',
        config: {
            id: 'convert',
            handler: controller.start,
            validate: {
                payload: Joi.object().length(1).keys({
                    resumeId: validations.id.required(),
                    templateId: validations.id,
                    format: validations.format.required()
                })
            }
        }
    }, {
        method: 'GET',
        path: '/conversions/{id}',
        config: {
            id: 'conversion',
            handler: controller.view,
            validate: {
                params: {
                    id: validations.id
                }
            }
        }
    }, {
        method: 'DELETE',
        path: '/conversions/{id}',
        config: {
            id: 'cancelConvert',
            handler: controller.abort,
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
