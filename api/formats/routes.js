'use strict';

const Joi = require('joi');

exports.register = function (server, options, next) {

    // /resumes/{id}/formats
    //      GET     - Collection of all available formats for the resume
    // /resumes/{id}/formats/{format}
    //      GET     - Representation of the resume in the given format
    //      PUT     - Updates the formatted document for the resume

    server.route([{
        method: 'GET',
        path: '/resumes/{id}/formats',
        config: {
            id: 'availableFormats',
            handler: (request, reply) => {
                reply();
            }
        }
    }, {
        method: 'GET',
        path: '/resumes/{id}/formats/{format}',
        config: {
            id: 'format',
            handler: (request, reply) => {
                reply();
            }
        }
    }, {
        method: 'PUT',
        path: '/resumes/{id}/formats/{format}',
        config: {
            id: 'updateFormat',
            handler: (request, reply) => {
                reply();
            }
        }
    }]);

    next();
};

exports.register.attributes = {
    name: 'routes-formats',
    version: '0.0.1'
};
