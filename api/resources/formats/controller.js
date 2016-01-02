'use strict';

const Boom = require('boom');
const Models = require('../../data/models');
const Resume = Models.Resume;
const Document = Models.Document;

class FormatsController {

    constructor () {

    }

    * list (request, reply) {
        let resume = yield Resume.findById(request.params.id).lean();
        if (!resume) {
            return reply(Boom.notFound('The resume could not be found'));
        }

        reply(Object.keys(resume.formats));
    }

    * view (request, reply) {
        const format = request.params.format.toLowerCase();

        let doc = yield Document.findOne({ 'resumeId': request.params.id, 'format': format });
        if (!doc) {
            return reply(Boom.notFound('The document could not be found'));
        }

        switch (format) {
            case 'md':
                return reply(doc.content).type('text/markdown');
            case 'html':
                return reply(doc.content).type('text/html');
            case 'pdf':
                return reply(doc.content).type('application/pdf');
            default:
                return reply(doc);
        }
    }

    * update (request, reply) {
        // TODO: Implement this to update the document contents for a given format
        //       creating the resource if necessary.  Remember to be idempotent.
        reply();
    }

    * remove (request, reply) {
        let format = request.params.format.toLowerCase();
        if (format === 'md') {
            return reply(Boom.badData('The original markdown format may not be removed'));
        }

        let resume = yield Resume.find({ _id: request.params.id, userId: request.auth.credentials.sub });
        if (!resume) {
            return reply(Boom.notFound('The resume could not be found'));
        }

        let docId = resume.formats[format];
        if (!docId) {
            return reply();
        }

        // Remove the document
        yield Document.remove({ _id: docId });

        // Then remove the format from the links
        resume.formats[format] = undefined;
        yield resume.save();

        return reply();
    }
}

module.exports = FormatsController;
