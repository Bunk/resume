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
        let userId = request.auth.credentials.sub;

        let results = yield Resume.find({ userId: userId })
            .skip(start * limit)
            .limit(limit);

        return reply({
            start: start,
            limit: limit,
            count: results.length,
            items: results
        });
    }

    * view (request, reply) {

        let resume = yield Resume.findById(request.params.id);
        if (resume.userId !== request.auth.credentials.sub) {
            reply(Boom.unauthorized());
        }
        return reply(resume);
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

        let resume = yield Resume.create({
            userId: request.auth.credentials.sub,
            formats: {}
        });
        let doc = yield Document.create({
            resumeId: resume._id,
            content: content,
            encoding: 'utf8',
            format: request.payload.format.toLowerCase()
        });
        resume.formats.md = doc._id;
        resume = yield resume.save();

        return reply(resume)
            .created(request.to('read', { params: { id: resume.id } }));
    }

    * update (request, reply) {

        delete request.payload.userId;
        delete request.payload.formats;
        delete request.payload.createdAt;
        request.payload.updatedAt = Date.now();

        let query = { _id: request.params.id, userId: request.auth.credentials.sub };
        let found = yield Resume.findOneAndUpdate(query, request.payload, { new: true });
        if (!found) {
            return reply(Boom.notFound());
        }

        return reply(found.toClient());
    }

    * delete (request, reply) {
        let query = { _id: request.params.id, userId: request.auth.credentials.sub };
        let found = yield Resume.findOne(query);
        if (!found) {
            return reply();
        }

        let formats = found.toObject().formats;
        for (let key of Object.keys(formats)) {
            yield Document.remove({ _id: formats[key] });
        }

        yield found.remove();

        return reply();
    }
}

module.exports = ResumeController;
