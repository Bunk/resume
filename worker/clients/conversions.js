'use strict';

const Client = require( './base' );
const Config = require( '../config' );

let internals = {
    endpoint: ( conversion ) => {
        return `${Config.api.conversions}/${conversion.id}`;
    },
    headers: { Authorization: `Bearer ${Config.api.conversionsKey}` }
};

class ConversionsClient extends Client {

    update( conversion, status ) {
        let options = {
            url: internals.endpoint( conversion ),
            headers: internals.headers,
            body: {
                resume: conversion.resume,
                inputFormat: conversion.inputFormat,
                outputFormat: conversion.outputFormat,
                status: status
            },
            json: true
        };
		return super.request( 'put', options );
    }
}

module.exports = new ConversionsClient();
