'use strict';

const JackRabbit = require('jackrabbit');
const Wreck = require('wreck');
const Config = require('./config');

let rabbit = JackRabbit(Config.rabbit.url);
let exchange = rabbit.default();
let queue = exchange.queue({ name: 'conversion_queue', prefetch: 1, durable: true });

queue.consume(function onMessage (data, ack) {
    console.log(`Running conversion`, data.conversion);

    let buf = new Buffer(data.input.content);
    let content = buf.toString(data.input.encoding);

    data.conversion.status = 'running';

    let conversionApi = `${Config.api.conversions}/${data.conversion.id}`;
    let authHeader = { 'Authorization': `Bearer ${Config.api.conversionsKey}` };
    let update = JSON.stringify(data.conversion);
    Wreck.put(conversionApi, { headers: authHeader, payload: update }, handle((err, res, payload) => {

        data.conversion.status = 'complete';
        let update = JSON.stringify(data.conversion);
        Wreck.put(conversionApi, { headers: authHeader, payload: update }, handle((err, res, payload) => {

            console.log('Successfully converted', data.conversionId);
            ack();
        }));
    }));


    function handle (callback) {
        return (err, res, payload) => {
            if (err) {
                return console.log(`Error: ${err}`);
            }
            if (res.statusCode >= 300) {
                return console.log(`Delete: ${res.statsuCode}: ${res.statusMessage}`);
            }

            return callback(err, res, payload);
        }
    }
});
