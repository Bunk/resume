'use strict';

const Request = require( 'request' );

class ResourceClient {
    request( method, options ) {
        return new Promise( ( resolve, reject ) => {

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
