'use strict';

const Mongoose      = require('mongoose');
const Schema        = Mongoose.Schema;

const internals = {
    resumeSchema: new Schema({
        formats         : {
            md              : { type: Schema.Types.ObjectId },
            pdf             : { type: Schema.Types.ObjectId },
            html            : { type: Schema.Types.ObjectId }
        },
        createdAt       : { type: Date, default: Date.now },
        updatedAt       : { type: Date, default: Date.now }
    }),
    documentSchema: new Schema({
        content         : { type: Buffer, required: true },
        format          : { type: String, required: true },
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

    toClient: function () {
        let obj = this.toObject();

        obj.id = obj._id;
        delete obj._id;
        delete obj.__v;

        return obj;
    }
};

internals.documentSchema.methods.toClient = internals.toClient;
internals.resumeSchema.methods.toClient = internals.toClient;
internals.templateSchema.methods.toClient = internals.toClient;
internals.conversionSchema.methods.toClient = internals.toClient;

module.exports = {
    Document    : Mongoose.model('documents', internals.documentSchema),
    Resume      : Mongoose.model('resume', internals.resumeSchema),
    Template    : Mongoose.model('template', internals.templateSchema),
    Conversion  : Mongoose.model('conversion', internals.conversionSchema)
};
