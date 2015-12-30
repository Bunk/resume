'use strict';

const co = require('co');
const Joi = require('joi');
const Controller = require('./controller');

exports.register = function (server, options, next) {

    // /resumes/{id}/formats
    //      GET     - Collection of all available formats for the resume
    // /resumes/{id}/formats/{format}
    //      GET     - Representation of the resume in the given format
    //      PUT     - Updates the formatted document for the resume

    let controller = new Controller(options);
    let validations = {
        id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
        format: Joi.string().valid(['html', 'pdf', 'md']).insensitive()
    };

    server.route([{
        method: 'GET',
        path: '/resumes/{id}/formats',
        config: {
            id: 'availableFormats',
            handler: {
                async: co.wrap(controller.list)
            }
        }
    }, {
        method: 'GET',
        path: '/resumes/{id}/docs/{format}',
        config: {
            id: 'format',
            handler: {
                async: co.wrap(controller.view)
            },
            validate: {
                params: {
                    id: validations.id,
                    format: validations.format
                }
            }
        }
    }, {
        method: 'PUT',
        path: '/resumes/{id}/docs/{format}',
        config: {
            id: 'updateFormat',
            handler: {
                async: co.wrap(controller.update)
            }
        }
    }, {
        method: 'DELETE',
        path: '/resumes/{id}/docs/{format}',
        config: {
            id: 'removeFormat',
            handler: {
                async: co.wrap(controller.remove)
            }
        }
    }]);

    next();
};

exports.register.attributes = {
    name: 'routes-formats',
    version: '0.0.1'
};
