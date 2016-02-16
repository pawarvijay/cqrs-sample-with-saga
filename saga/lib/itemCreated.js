/**
 * Created with JetBrains WebStorm.
 * User: vijay
 * Date: 15/2/16
 * Time: 6:34 PM
 * To change this template use File | Settings | File Templates.
 */

// if exports is an array, it will be the same like loading multiple files...
//module.exports = require('cqrs-saga').defineSaga({// event to match..
module.exports = require('cqrs-saga').defineSaga({// event to match...
    name: 'itemCreated', // optional, default is file name without extension
    id: 'payload.id',
    aggregate : 'item',
    existing: false, // if true it will check if there is already a saga in the db and only if there is something it will continue...
    payload: 'payload', // if not defined it will pass the whole event...
    priority: 1 // optional, default Infinity, all sagas will be sorted by this value
}, function (evt, saga, callback) {

    // if you have multiple concurrent events that targets the same saga, you can catch it like this:
    //if (saga.actionOnCommit === 'create') {
       // return this.retry(callback);
        // or
        //return this.retry(100, callback); // retries to handle again in 0-100ms
        // or
        //return this.retry({ from: 500, to: 8000 }, callback); // retries to handle again in 500-8000ms
   // }

    saga.set('orderId', 55555);
    saga.set('totalCosts', 4444);
    // or
    // saga.set({ orderId: evt.aggregate.id, totalCosts: evt.payload.totalCosts });

/*    var cmd = {

        // if you don't pass an id it will generate a new one
        id: '99969849-c791-4ea6-8efb-2f753fdcdfca',
        name: 'createAcccount',
        aggregate: {
            name: 'account'
        },
        payload: {
            transactionId: 99999999999999,
            seats: 88888888
        },

        // to transport meta infos (like userId)...
        // if not defined, it will use the meta value of the event
        meta: evt.meta
    };*/


    var cmd =  {
        id: '99969849-c791-4ea6-8efb-2f753fdcdfca',
        command: 'createAcccount',
        payload: {
            transactionId: 99999999999999,
            seats: 88888888
        },

        meta: evt.meta
    }

    saga.addCommandToSend(cmd);

    saga.commit(callback);
});
// optional define a function to that returns an id that will be used as saga id
//.useAsId(function (evt) {
//  return 'newId';
//});
// or
//.useAsId(function (evt, callback) {
//  callback(null, 'newId');
//});
//
// optional define a function that checks if an event should be handled
//.defineShouldHandle(function (evt, saga) {
//  return true;
//});
// or
//.defineShouldHandle(function (evt, saga, callback) {
//  callback(null, true');
//});
