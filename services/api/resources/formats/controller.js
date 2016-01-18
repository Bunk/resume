'use strict';

const co = require( 'co' );
const Read = require( 'co-read' );
const Boom = require( 'boom' );
const Models = require( '../../data/models' );
const Resume = Models.Resume;
const Document = Models.Document;

let internals = {
    getResumeQuery: ( request ) => {
        let id = request.params.id;
        let query = { _id: id };
        if ( !request.auth.credentials.scopes.system ) {
            query.userId = request.auth.credentials.sub;
        }

        return query;
    }
};

class FormatsController {

    constructor() {

    }

    * list( request, reply ) {
        let resume = yield Resume.findById( request.params.id ).lean();
        if ( !resume ) {
            return reply( Boom.notFound( 'The resume could not be found' ) );
        }

        reply( Object.keys( resume.formats ) );
    }

    * view( request, reply ) {
        const format = request.params.format.toLowerCase();

        let doc = yield Document.findOne( { resumeId: request.params.id, format: format } );
        if ( !doc ) {
            return reply( Boom.notFound( 'The document could not be found' ) );
        }

        switch ( format ) {
            case 'md':
                return reply( doc.content ).type( 'text/markdown' );
            case 'html':
                return reply( doc.content ).type( 'text/html' );
            case 'pdf':
                return reply( doc.content ).type( 'application/pdf' );
            default:
                return reply( doc );
        }
    }

    * update( request, reply ) {
        let format = request.params.format.toLowerCase();
        if ( format === 'md' ) {
            return reply( Boom.badData( 'The original markdown format may not be removed' ) );
        }

        let resume = yield Resume.findOne( internals.getResumeQuery( request ) );
        if ( !resume ) {
            return reply( Boom.notFound( 'The resume could not be found' ) );
        }

        let doc = yield Document.findOneAndUpdate(
            { resumeId: resume.id, format: format },
            { resumeId: resume.id, format: format, content: request.payload.content, encoding: request.payload.encoding },
            { new: true, upsert: true } );

        let exists = resume.formats[format];
        resume.formats[format] = doc.id;
        yield resume.save();

        let response = reply( doc );
        if ( !exists ) {
            response.created( request.to( 'format', { params: { id: doc.id, format } } ) );
        }
    }

    * remove( request, reply ) {
        let format = request.params.format.toLowerCase();
        if ( format === 'md' ) {
            return reply( Boom.badData( 'The original markdown format may not be removed' ) );
        }

        let resume = yield Resume.findOne( { _id: request.params.id, userId: request.auth.credentials.sub } );
        if ( !resume ) {
            return reply( Boom.notFound( 'The resume could not be found' ) );
        }

        let docId = resume.formats[format];
        if ( !docId ) {
            return reply();
        }

        // Remove the document
        yield Document.remove( { _id: docId } );

        // Then remove the format from the links
        resume.formats[format] = undefined;
        yield resume.save();

        return reply();
    }
}

module.exports = FormatsController;
