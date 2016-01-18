'use strict';

const Client = require( './base' );
const Config = require( '../config' );

let internals = {
    endpoint: ( conversion ) => {
        return `${Config.api.documents}/${conversion.resume}/docs/${conversion.outputFormat}`;
    }
};

class DocumentsClient extends Client {

    upload( conversion, content ) {
        let options = {
            url: internals.endpoint( conversion ),
            formData: {
                content: new Buffer( content ),
                encoding: 'utf8'
            }
        };
        console.log( `Documents : Uploading : ${conversion.outputFormat}` );
        return super.request( 'put', options );
    }
}

module.exports = new DocumentsClient();
