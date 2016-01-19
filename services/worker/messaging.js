'use strict';

const Wascally = require( 'wascally' );
const Topology = require( './topology' );
const Convertor = require( './convertor' );
const Conversions = require( './clients/conversions' );
const Documents = require( './clients/documents' );

let internals = {
	healthErr: 'Rabbit topology has not been configured, yet'
};
internals.handle = ( msg ) => {
	let buf = new Buffer( msg.body.input.content );
	let content = buf.toString( msg.body.input.encoding );

	Conversions.update( msg.body.conversion, 'running' )
		.then( conversion => {

			let conversionOpt = {
				inputFormat: conversion.inputFormat,
				outputFormat: conversion.outputFormat
			};
			return Convertor.convert( content, conversionOpt )
				.then( content => {
					return Documents.upload( conversion, content );
				} )
				.then( doc => {
					return Conversions.update( conversion, 'complete' );
				} )
				.then( () => {
					return msg.ack();
				} );
		} )
		.catch( err => {

			console.log( `Task : ${err.stack}` );
			msg.reject();
		} );
};

exports.register = function( server, options, next ) {

	Wascally.handle( Topology.topics.convert, internals.handle );

    Topology.configure( Wascally, options )
		.then( () => internals.healthErr = null )
		.catch( err => internals.healthErr = err.message );

    next();
};

exports.testHealth = function testHealth( cb ) {
	if ( internals.healthErr ) {
		return cb( true, internals.healthErr );
	}
	return cb( null, 'Rabbit topology successfully configured!' );
};

exports.register.attributes = {
    name: 'worker-messaging',
    version: '0.0.1'
};
