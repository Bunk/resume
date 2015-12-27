'use strict';

const Shortid = require('shortid');
const Boom = require('boom');
const Data = require('../../data');

let db = new Data();

class ResumeController {

    list (request, reply) {
        return reply(db.all());
    }

    upload (request, reply) {
        let data = {};

        try {
            data = db.add(request.payload);
        } catch (e) {
            return reply(Boom.badRequest(e.message));
        }

        reply(data).created(request.to('read', { params: { id: data.id } }));
    }

    update (request, reply) {
        let data = {};
        try {
            db.remove(request.params.id);
            data = db.add(request.payload);
        } catch (e) {
            return reply(Boom.badRequest(e.message));
        }
        reply(data);
    }

    delete (request, reply) {
        try {
            // TODO: Remove translations
            // TODO: Remove cached data
            db.remove(request.params.id);
            return reply();
        } catch (e) {
            return reply(Boom.notFound(e.message));
        }
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
