'use strict';

const co = require( 'co' );
const Joi = require( 'joi' );
const Controller = require( './controller' );

exports.register = function( server, options, next ) {
    // /resumes
    //      POST    - Create a new resume representation
    //      GET     - List of all resume representations
    // /resumes/{id}
    //      GET     - Representation of the resume in its original format
    //      PUT     - Replaces the given resume state
    //      DELETE  - Removes the given resume state

    let controller = new Controller( options );

    let validations = {
        id: Joi.string().regex( /^[0-9a-fA-F]{24}$/ ),
        content: Joi.string().required().min( 1 ),
        contentFormat: Joi.string().valid( [ 'md' ] ).insensitive(),
        outputFormat: Joi.string().valid( [ 'html', 'pdf', 'md' ] ).insensitive()
    };

    server.route( [ {
        method: 'GET',
        path: '/resumes',
        config: {
            id: 'list',
            handler: {
                async: co.wrap( controller.list )
            },
            validate: {
                query: Joi.object().keys( {
                    start: Joi.number().min( 0 ),
                    limit: Joi.number().min( 1 ).max( 20 )
                } )
            },
            plugins: {
                hal: {
                    embedded: {
                        items: {
                            path: 'items',
                            href: './{item.id}'
                        }
                    }
                }
            }
        }
    }, {
        method: 'POST',
        path: '/resumes',
        config: {
            id: 'create',
            handler: {
                async: co.wrap( controller.upload )
            },
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data'
            },
            validate: {
                payload: Joi.object().keys( {
                    file: Joi.any().required(),
                    format: validations.contentFormat.required()
                } )
            }
        }
    }, {
        method: 'GET',
        path: '/resumes/{id}',
        config: {
            id: 'read',
            handler: {
                async: co.wrap( controller.view )
            },
            validate: {
                params: {
                    id: validations.id
                }
            }
        }
    }, {
        method: 'PUT',
        path: '/resumes/{id}',
        config: {
            id: 'update',
            handler: {
                async: co.wrap( controller.update )
            },
            validate: {
                params: {
                    id: validations.id
                },
                payload: Joi.object().keys( {
                    content: validations.content,
                    contentFormat: validations.contentFormat
                } )
            }
        }
    }, {
        method: 'DELETE',
        path: '/resumes/{id}',
        config: {
            id: 'delete',
            handler: {
                async: co.wrap( controller.delete )
            },
            validate: {
                params: {
                    id: validations.id
                }
            }
        }
    } ] );

    next();
};

exports.register.attributes = {
    name: 'routes-resumes',
    version: '0.0.1'
};
