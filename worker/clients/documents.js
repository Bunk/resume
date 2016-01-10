'use strict';

const Client = require( './base' );
const Config = require( '../config' );

let internals = {
    endpoint: ( conversion ) => {
        return `${Config.api.documents}/${conversion.resume}/docs/${conversion.outputFormat}`;
    },
    headers: {
        Authorization: `Bearer ${Config.api.documentsKey}`
    }
};

class DocumentsClient extends Client {

    upload( conversion, content ) {
        let options = {
            url: internals.endpoint( conversion ),
            headers: internals.headers,
            formData: {
                content: new Buffer( content ),
                encoding: 'utf8'
            }
        };
        return super.request( 'put', options );
    }
}

module.exports = new DocumentsClient();
