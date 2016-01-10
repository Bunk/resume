'use strict';

const JackRabbit = require( 'jackrabbit' );
const PDC = require( 'pdc' );
const Config = require( './config' );
const Conversions = require( './clients/conversions' );
const Documents = require( './clients/documents' );

let rabbit = JackRabbit( Config.rabbit.url );
let exchange = rabbit.default();
let queue = exchange.queue( { name: 'conversion_queue', prefetch: 1, durable: true } );
let internals = {
	conversionApi: `${Config.api.conversions}`
};

queue.consume( function onMessage( data, ack ) {
	let buf = new Buffer( data.input.content );
	let content = buf.toString( data.input.encoding );

	Conversions.update( data.conversion, 'running' )
		.then( conversion => {

			console.log( `Task : Converting`, data.conversion );
			return convert( content, conversion.outputFormat )
				.then( content => {

					console.log( `Task : Updating Document : ${conversion.outputFormat}` );
					return Documents.upload( conversion, content );
				} )
				.then( doc => {

					console.log( `Task : Updating Status : ${conversion.id}` );
					return Conversions.update( conversion, 'complete' );
				} )
				.then( () => {

					console.log( `Task : Completed : ${data.conversion.id}` );
					return ack();
				} );
		} )
		.catch( err => {

			// TODO: Poison queue the message
			console.log( `Task : ${err.stack}` );
			ack();
		} );

	function convert ( content, format ) {
		return new Promise( ( resolve, reject ) => {
			PDC( content, 'markdown', format, function( err, result ) {
				if ( err ) {
					reject( err );
				}
				resolve( result );
			} );
		} );
	}
} );
