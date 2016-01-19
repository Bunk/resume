'use strict';

const Hapi = require( 'hapi' );
const Package = require( './package.json' );
const Config = require( './config' );
const Messaging = require( './messaging' );

let plugins = [
{
    register: require( 'good' ),
    options: {
        opsInterval: 1000,
        reporters: [ {
            reporter: require( 'good-console' ),
            events: { log: '*', response: '*' }
        } ]
    }
}, {
	register: require( 'hapi-and-healthy' ),
	options: {
        path: '/health',
		name: Package.name,
		version: Package.version,
		env: process.env.NODE_ENV || 'development',
		test: {
			node: [ Messaging.testHealth ]
		}
	}
}, {
    register: Messaging,
	options: Config
} ];

let server = new Hapi.Server( { debug: { request: [ 'info', 'error' ] } } );
server.connection( { port: Config.port } );
server.register( plugins, ( err ) => {

    if ( err ) {
        throw err;
    }
    server.start( ( err ) => {

        if ( err ) {
            throw err;
        }
        server.log( 'info', `Running [${Package.name}] at [${server.info.uri}]` );
    } );
} );
