'use strict';

const Backoff = require( 'backoff' );

let internals = {};
internals.exchanges = {
    convert: { name: 'convert-ex', type: 'direct', persistent: true },
    convertDead: { name: 'deadletter-ex', type: 'topic', persistent: true }
};
internals.queues = {
    convert: { name: 'convert-q', deadLetter: 'deadletter-ex' },
    convertDead: { name: 'deadletter-q' }
};
internals.topics = {
    convert: 'convert.run'
};
internals.tryConfigure = ( rabbit, config ) => {

    rabbit.reset();
    return rabbit.configure( {
        connection: {
            user: config.messaging.user,
            pass: config.messaging.password,
            server: config.messaging.server
        },
        exchanges: [
            internals.exchanges.convert,
            internals.exchanges.convertDead
        ],
        queues: [
            internals.queues.convert,
            internals.queues.convertDead
        ],
        bindings: [
            {
                exchange: internals.exchanges.convert.name,
                target: internals.queues.convert.name,
                keys: [ internals.topics.convert ]
            },
            {
                exchange: internals.exchanges.convertDead.name,
                target: internals.queues.convertDead.name,
                keys: [ '#' ]
            }
        ]
    } );
};
internals.configure = ( rabbit, config ) => {

    if ( config.messaging.subscribe ) {
        config.messaging.subscribe.forEach( key => {
            internals.queues[key].subscribe = true;
        } );
    }

    return new Promise( function( resolve, reject ) {

        let backoff = Backoff.exponential( { randomisationFactor: 0.1 } );
        backoff.failAfter( 10 );

        backoff.on( 'backoff', ( number, delay, err ) => {
            console.log( `Topology: Config:`, { attempt: number, delay: `${delay}ms` }, err );
        } );

        backoff.on( 'ready', ( number, delay ) => {
            internals.tryConfigure( rabbit, config )
                .then( resolve )
                .catch( err => backoff.backoff( err ) );
        } );

        backoff.on( 'fail', err => reject( err ) );

        backoff.backoff();
    } );
};

module.exports = {
    exchanges: internals.exchanges,
    queues: internals.queues,
    topics: internals.topics,
    configure: internals.configure
};
