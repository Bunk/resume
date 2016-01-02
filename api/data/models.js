'use strict';

const Mongoose      = require('mongoose');
const Schema        = Mongoose.Schema;

const internals = {
    resumeSchema: new Schema({
        userId          : { type: String, required: true, index: true },
        formats         : {
            md              : { type: Schema.Types.ObjectId },
            pdf             : { type: Schema.Types.ObjectId },
            html            : { type: Schema.Types.ObjectId }
        },
        createdAt       : { type: Date, default: Date.now },
        updatedAt       : { type: Date, default: Date.now }
    }),
    documentSchema: new Schema({
        resumeId        : { type: Schema.Types.ObjectId, index: true },
        content         : { type: Buffer, required: true },
        format          : { type: String, required: true, index: true },
        encoding        : { type: String, required: true },
        createdAt       : { type: Date, default: Date.now },
        updatedAt       : { type: Date, default: Date.now }
    }),
    templateSchema: new Schema({

    }),
    conversionSchema: new Schema({
        outputFormat    : { type: String, required: true },
        resume          : {
            id          : { type: String, required: true },
            content     : { type: String, required: true },
            format      : { type: String, required: true, trim: true }
        },
        template        : {
            id          : { type: String, required: true }
        },
        status          : { type: String, default: 'requested' },
        createdAt       : { type: Date, default: Date.now },
        updatedAt       : { type: Date, default: Date.now }
    }),

    init : function () {
        let cleanMongoFields = (doc, ret, options) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        };
        // Resume
        internals.resumeSchema.set('toJSON', { transform: cleanMongoFields });
        internals.resumeSchema.methods = {
            toHal: function (rep, next) {
                if (rep.entity.formats.md) {
                    link('documents', './docs/md', 'md', 'text/markdown');
                }
                if (rep.entity.formats.html) {
                    link('documents', './docs/html', 'html', 'text/html');
                }
                if (rep.entity.formats.pdf) {
                    link('documents', './docs/pdf', 'pdf', 'application/pdf');
                }
                next();

                function link (rel, uri, name, mime) {
                    let link = rep.link(rel, uri);
                    link.name = name;
                    link.type = mime;
                }
            }
        };

        // Document
        internals.documentSchema.set('toJSON', { transform: cleanMongoFields });
        internals.documentSchema.methods = {
            toHal: function (rep, next) {
                next();
            }
        };

        // Conversion Task
        internals.conversionSchema.set('toJSON', { transform: cleanMongoFields });
        internals.conversionSchema.methods = {
            toHal: function (rep, next) {
                next();
            }
        };
    }
};

internals.init();

module.exports = {
    Document    : Mongoose.model('documents', internals.documentSchema),
    Resume      : Mongoose.model('resume', internals.resumeSchema),
    Template    : Mongoose.model('template', internals.templateSchema),
    Conversion  : Mongoose.model('conversion', internals.conversionSchema)
};
