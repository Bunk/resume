'use strict';

const Wascally = require( 'wascally' );
const Topology = require( '../shared/topology' );

let internals = {};

module.exports.register = ( server, options, next ) => {

    server.method( 'startConversion', ( conversion, document ) => {
        let message = {
            conversion: {
                id: conversion.id,
                resume: conversion.resume,
                inputFormat: conversion.inputFormat,
                outputFormat: conversion.outputFormat,
                status: conversion.status
            },
            input: {
                content: document.content,
                encoding: document.encoding
            }
        };

        Wascally.publish(
            Topology.exchanges.convert.name,
            Topology.topics.convert,
            message );
    }, {} );

    Topology.configure( Wascally, options ).done( next );
};

exports.register.attributes = {
    name: 'resume-messaging',
    version: '0.0.1'
};
