'use strict';

const Wascally = require( 'wascally' );
const Config = require( './config' );
const Convertor = require( './convertor' );
const Conversions = require( './clients/conversions' );
const Documents = require( './clients/documents' );
const Topology = require( '../shared/topology' );

let internals = { };
internals.init = () => {
	Wascally.handle( Topology.topics.convert, internals.handleConvert );

	Object.assign( Config.messaging, { subscribe: [ 'convert' ] } );
	Topology.configure( Wascally, Config ).done( () => { } );
};
internals.handleConvert = ( msg ) => {
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

internals.init();
