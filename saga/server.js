/**
 * Created with JetBrains WebStorm.
 * User: vijay
 * Date: 15/2/16
 * Time: 5:53 PM
 * To change this template use File | Settings | File Templates.
 */

var colors = require('../colors')
    , msgbus = require('../msgbus');


var pm = require('cqrs-saga')({
    // the path to the "working directory"
    // can be structured like
    // [set 1](https://github.com/adrai/node-cqrs-saga/tree/master/test/integration/fixture)
    sagaPath:  __dirname + '/lib',

    // optional, default is 800
    // if using in scaled systems and not guaranteeing that each event for a saga "instance"
    // dispatches to the same worker process, this module tries to catch the concurrency issues and
    // retries to handle the event after a timeout between 0 and the defined value
    retryOnConcurrencyTimeout: 1000,

    // optional, default is in-memory
    // currently supports: mongodb, redis, azuretable and inmemory
    // hint settings like: [eventstore](https://github.com/adrai/node-eventstore#provide-implementation-for-storage)
    // mongodb:
    sagaStore: {
        type: 'mongodb',
        host: 'localhost',                          // optional
        port: 27017,                                // optional
        dbName: 'domain',                           // optional
        collectionName: 'sagas',                    // optional
        timeout: 10000                              // optional
        // authSource: 'authedicationDatabase',        // optional
        // username: 'technicalDbUser',                // optional
        // password: 'secret'                          // optional
    },
    // or redis:
    /*    sagaStore: {
            type: 'redis',
            host: 'localhost',                          // optional
            port: 6379,                                 // optional
            db: 0,                                      // optional
            prefix: 'domain_saga',                      // optional
            timeout: 10000                              // optional
            // password: 'secret'                          // optional
    },*/

    // optional, default is in-memory
    // the revisionguard only works if aggregateId and revision are defined in event definition
    // currently supports: mongodb, redis, tingodb, azuretable and inmemory
    // hint settings like: [eventstore](https://github.com/adrai/node-eventstore#provide-implementation-for-storage)
    revisionGuard: {
        queueTimeout: 1000,                         // optional, timeout for non-handled events in the internal in-memory queue
        queueTimeoutMaxLoops: 3,                     // optional, maximal loop count for non-handled event in the internal in-memory queue

        type: 'redis',
        host: 'localhost',                          // optional
        port: 6379,                                 // optional
        db: 0,                                      // optional
        prefix: 'readmodel_revision',               // optional
        timeout: 10000                              // optional
        // password: 'secret'                          // optional
    }
});


pm.defineCommand({
    // optional, default is 'id'
    id: 'id',

    // optional, if defined the values of the event will be copied to the command (can be used to transport information like userId, etc..)
    meta: 'meta'
});

pm.defineEvent({
    // optional, default is 'name'
    name: 'event',

    // optional, default is 'aggregate.id'
    aggregateId: 'payload.id',

    // optional, default is 'revision'
    // will represent the aggregate revision, can be used in next command
    revision: 'head.revision',

    // optional
    version: 'version',

    // optional, if defined theses values will be copied to the command (can be used to transport information like userId, etc..)
    meta: 'meta',

    //EXTRA EXTRA ADDED ACCORDING https://github.com/adrai/node-cqrs-saga#handling-an-event
    id: 'id',
    payload: 'payload'
});

pm.init(function (err, warnings) {

    if (err) {
        return console.log(err);
    }

    console.log(pm.getInfo());

    msgbus.onEvent(function(evt) {
        console.log(colors.blue('\ saga -- received event ' + evt.event + ' from redis:'));
        console.log(evt);

        console.log(colors.cyan('\n->saga handle event ' + evt.event));

        pm.handle(evt);
    });

    console.log('Starting saga service'.cyan);
});

