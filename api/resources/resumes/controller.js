'use strict';

const co = require('co');
const Read = require('co-read');
const Shortid = require('shortid');
const Boom = require('boom');
const Models = require('../../data/models');
const Resume = Models.Resume;
const Document = Models.Document;

class ResumeController {

    * list (request, reply) {
        let start = request.query.start || 0;
        let limit = request.query.limit || 25;

        let results = yield Resume.find({})
            .skip(start * limit)
            .limit(limit);

        return reply(results.map(r => r.toClient()));
    }

    * view (request, reply) {
        let resume = yield Resume.findById(request.params.id);
        return reply(resume.toClient());
    }

    * upload (request, reply) {

        let content = yield (function * () {

            let bufs = [];

            var buffer;
            while (buffer = yield Read(request.payload.file)) {
                bufs.push(buffer);
            }

            return Buffer.concat(bufs);
        }());

        let doc = yield Document.create({
            content: content,
            encoding: 'utf8',
            format: request.payload.format
        });

        let resume = yield Resume.create({
            formats: {
                md: doc._id
            }
        });

        return reply(resume.toClient())
            .created(request.to('read', { params: { id: resume.id } }));
    }

    * create (request, reply) {
        // TODO: Handle file uploads
        var resume;

        try {
            request.payload.formats = [request.payload.contentFormat];
            resume = yield Resume.create(request.payload);
        } catch (e) {
            return reply(Boom.badRequest(e.message));
        }

        reply(resume.toClient()).created(request.to('read', { params: { id: resume.id } }));
    }

    * update (request, reply) {
        delete request.payload.formats;
        delete request.payload.createdAt;

        request.payload.updatedAt = Date.now();

        let found = yield Resume.findOneAndUpdate({ _id: request.params.id }, request.payload, { new: true });
        if (!found) {
            return reply(Boom.notFound());
        }

        return reply(found.toClient());
    }

    * delete (request, reply) {
        yield Resume.remove({ _id: request.params.id });
        return reply();
    }
}

module.exports = ResumeController;
