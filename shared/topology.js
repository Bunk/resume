'use strict';

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
internals.configure = ( rabbit, config ) => {
    if ( config.messaging.subscribe ) {
        config.messaging.subscribe.forEach( key => {
            internals.queues[key].subscribe = true;
        } );
    }

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

module.exports = {
    exchanges: internals.exchanges,
    queues: internals.queues,
    topics: internals.topics,
    configure: internals.configure
};
