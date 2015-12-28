'use strict';

const Shortid = require('shortid');
const Boom = require('boom');
const Models = require('../../data/models');
const Resume = Models.Resume;

class ResumeController {

    * list (request, reply) {
        let start = request.query.start || 0;
        let limit = request.query.limit || 25;

        let results = yield Resume.find({})
            .skip(start * limit)
            .limit(limit);

        return reply(results.map(r => r.toClient()));
    }

    * upload (request, reply) {
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

    view (request, reply) {
        let data = db.get(request.params.id);
        if (!data) {
            return reply(Boom.notFound());
        }
        return reply(data);
    }
}

module.exports = ResumeController;
