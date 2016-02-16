// server.js is the starting point of the domain process:
//
// `node server.js` 
var colors = require('../colors')
  , msgbus = require('../msgbus');


var domain = require('cqrs-domain')({
    domainPath: __dirname + '/lib',
    eventStore: {
        type: 'mongodb',
        host: 'localhost',                          // optional
        port: 27017,                                // optional
        dbName: 'domain',                           // optional
        eventsCollectionName: 'events',             // optional
        snapshotsCollectionName: 'snapshots',       // optional
        transactionsCollectionName: 'transactions', // optional
        timeout: 10000                              // optional
        // authSource: 'authedicationDatabase',        // optional
        // username: 'technicalDbUser',                // optional
        // password: 'secret'                          // optional
    },
    aggregateLock: {
        type: 'redis',
        host: 'localhost',                          // optional
        port: 6379,                                 // optional
        db: 0,                                      // optional
        prefix: 'domain_aggregate_lock',            // optional
        timeout: 10000                              // optional
        // password: 'secret'                          // optional
    },
    deduplication: {
        type: 'redis',
        ttl: 1000 * 1, // 1 hour          // optional
        host: 'localhost',                          // optional
        port: 6379,                                 // optional
        db: 0,                                      // optional
        prefix: 'BUMPER_lock',            // optional
        timeout: 10000                              // optional
        // password: 'secret'                          // optional
    }
});

domain.defineCommand({
    id: 'id',
    name: 'command',
    aggregateId: 'payload.id',
    aggregate: 'aggregate.name',
    payload: 'payload',
    revision: 'head.revision',
    version: 'version',
    meta: 'meta'
});
domain.defineEvent({
    correlationId: 'commandId',
    id: 'id',
    name: 'event',
    aggregateId: 'payload.id',
    aggregate: 'aggregate.name',
    payload: 'payload',
    revision: 'head.revision',
    version: 'version',
    meta: 'meta',
    commitStamp: 'commitStamp'
});

domain.init(function(err) {
    if (err) {
        return console.log(err);
    }

    // on receiving a message (__=command__) from msgbus pass it to 
    // the domain calling the handle function
    msgbus.onCommand(function(cmd) {
        console.log(colors.blue('\ndomain -- received command ' + cmd.command + ' from redis:'));
        console.log(cmd);
    
        console.log(colors.cyan('\n-> handle command ' + cmd.command));
        
        domain.handle(cmd);
    });

    // on receiving a message (__=event) from domain pass it to the msgbus
    domain.onEvent(function(evt) {
        console.log('domain: ' + evt.event);
        msgbus.emitEvent(evt);
    });
    
    console.log('Starting domain service'.cyan);
});