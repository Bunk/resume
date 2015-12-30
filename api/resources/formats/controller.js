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
        let format = request.params.format.toLowerCase();

        // TODO: Create a mongo index for this lookup
        let resume = yield Resume.findById(request.params.id);
        if (!resume) {
            return reply(Boom.notFound('The resume could not be found'));
        }

        let docId = resume.formats[format];
        if (!docId) {
            return reply(Boom.notFound('The resume has not been converted to that format'));
        }

        let doc = yield Document.findById(docId);
        if (!doc) {
            return reply(Boom.notFound());
        }

        // TODO: Depending on the content-negotiation, send back the appropriate data
        reply(doc.toClient());
    }

    * update (request, reply) {
        reply();
    }

    * remove (request, reply) {
        let format = request.params.format.toLowerCase();
        if (format === 'md') {
            return reply(Boom.badData('The original markdown format may not be removed'));
        }

        let resume = yield Resume.findById(request.params.id);
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
