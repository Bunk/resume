'use strict';

const co = require( 'co' );
const Boom = require( 'boom' );
const Models = require( '../../data/models' );
const Resume = Models.Resume;
const Template = Models.Template;
const Conversion = Models.Conversion;
const Document = Models.Document;

const internals = {
    queue: {
        key: 'conversion_queue',
        persistent: true
    },
    getConversionQuery: ( request ) => {
        let conversionId = request.params.id;
        let claims = request.auth.credentials.scopes.conversions;

        let query = { _id: conversionId };
        if ( !claims.system ) {
            query._owner = request.auth.credentials.sub;
        }

        return query;
    }
};

class ConversionController {

    constructor( config, exchange ) {
        this.exchange = exchange;
        this.queue = exchange.queue( {
            name: internals.queue.key,
            durable: true
        } );
    }

    * view( request, reply ) {
        let query = internals.getConversionQuery( request );
        let conversion = yield Conversion.findOne( query );
        return reply( conversion );
    }

    * start( request, reply ) {
        let resumeId = request.payload.resumeId;
        let userId = request.auth.credentials.sub;
        let inputFormat = 'md';
        let outputFormat = request.payload.format;

        // Pull the existing resume resource
        let query = { _id: resumeId, userId: request.auth.credentials.sub };
        let resume = yield Resume.findOne( query ).populate( `formats.${inputFormat}` );
        if ( !resume || !resume.formats[inputFormat] ) {
            return reply( Boom.badData( 'Invalid resume' ) );
        }

        // Return a validation error if a conversion is already in progress for this document
        let conversion = yield Conversion.findOne( { resumeId, outputFormat } );
        if ( conversion ) {
            return reply( Boom.badData( 'A conversion is already in progress' ) );
        }

        let doc = resume.formats[inputFormat];
        let documentId = doc.id;
        conversion = yield new Conversion( {
            _owner: userId,
            resume: resumeId,
            inputFormat,
            outputFormat
        } ).save();

        this.exchange.publish( {
            conversion: {
                id: conversion.id,
                resume: conversion.resume,
                inputFormat: conversion.inputFormat,
                outputFormat: conversion.outputFormat,
                status: conversion.status
            },
            input: {
                content: doc.content,
                encoding: doc.encoding
            }
        }, { key: internals.queue.key } );

        return reply( conversion )
            .created( request.to( 'conversion', { params: { id: conversion.id } } ) );
    }

    * update( request, reply ) {
        // TODO: Allow changing of more than status here
        let query = internals.getConversionQuery( request );
        let conversion = yield Conversion.findOne( query );
        conversion.status = request.payload.status;
        conversion = yield conversion.save();
        reply( conversion );
    }

    * abort( request, reply ) {
        let query = internals.getConversionQuery( request );
        yield Conversion.remove( query );
        return reply();
    }
};

module.exports = ConversionController;
