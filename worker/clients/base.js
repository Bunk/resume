'use strict';

const Request = require( 'request' );
const Config = require( '../config' );

let internals = {
    headers: { Authorization: `Bearer ${Config.api.key}` }
};

class ResourceClient {
    request( method, options ) {
        return new Promise( ( resolve, reject ) => {
            options.headers = internals.headers;
			Request[method]( options, ( err, response, body ) => {

                if ( err ) {
					return reject( err );
				}
				if ( response.statusCode >= 300 ) {
					return reject( new Error( `${response.statusCode} : ${response.statusMessage}` ) );
				}

				return resolve( body );
			} );
		} );
    }
}

module.exports = ResourceClient;
