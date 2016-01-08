'use strict';

const JackRabbit = require( 'jackrabbit' );
const Wreck = require( 'wreck' );
const Config = require( './config' );

let rabbit = JackRabbit( Config.rabbit.url );
let exchange = rabbit.default();
let queue = exchange.queue( { name: 'conversion_queue', prefetch: 1, durable: true } );
let internals = {
	conversionApi: `${Config.api.conversions}`
};

queue.consume( function onMessage( data, ack ) {
	console.log( `Running conversion`, data.conversion );

	let buf = new Buffer( data.input.content );
	let content = buf.toString( data.input.encoding );

	updateConversionStatus( data.conversion, 'running' )
		.then( () => {
			console.log( `Task : Running : ${data.conversion.id}` );
			return convert();
		} )
		.then( () => {
			console.log( `Task : Complete : ${data.conversion.id}` );
			return updateConversionStatus( data.conversion, 'complete' );
		} )
		.then( () => {
			return ack();
		} )
		.catch( err => {
			console.log( `Task : Error: ${err.stack}` );
		} );

	function convert () {
		return new Promise( ( resolve, reject ) => {
			// TODO: Implement this
			return resolve();
		} );
	}

	function updateConversionStatus ( conversion, status ) {
		return new Promise( ( resolve, reject ) => {

			let headers = { Authorization: `Bearer ${Config.api.conversionsKey}` };
			let payload = JSON.stringify( Object.assign( {}, conversion, { status } ) );
			Wreck.put( `${Config.api.conversions}/${conversion.id}`, { headers, payload }, ( err, response, payload ) => {

				if ( err ) {
					return reject( err );
				}

				if ( response.statusCode >= 300 ) {
					return reject( new Error( `{res.statusCode} : ${res.statusMessage}` ) );
				}

				return resolve( { response, payload } );
			} );
		} );
	}
} );
