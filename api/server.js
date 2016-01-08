'use strict';

const Hapi = require( 'hapi' );
const Boom = require( 'boom' );
const Package = require( './package.json' );
const Config = require( './config' );

let plugins = [
    require( 'hapi-async-handler' ),
    require( 'hapi-to' ),
    require( 'hapi-auth-jwt2' ),
    require( 'bell' ),
    require( 'halacious' ),
{
    register: require( 'good' ),
    options: {
        opsInterval: 1000,
        reporters: [ {
            reporter: require( 'good-console' ),
            events: { log: '*', response: '*' }
        } ]
    }
},
{
    register: require( './data/mongo' ),
    options: { uri: Config.mongoUrl }
}, {
    register: require( './auth' ),
    options: Config
}, {
    register: require( './resources/resumes' ),
    options: Config
}, {
    register: require( './resources/conversions' ),
    options: Config
}, {
    register: require( './resources/formats' ),
    options: Config
} ];

let server = new Hapi.Server( { debug: { request: [ 'info', 'error' ] } } );
server.connection( {
    port: Config.port,
    routes: {
        response: { emptyStatusCode: 204 }
    }
} );

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
