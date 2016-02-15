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
    existing: true, // if true it will check if there is already a saga in the db and only if there is something it will continue...
    payload: 'payload', // if not defined it will pass the whole event...
    priority: 1 // optional, default Infinity, all sagas will be sorted by this value
}, function (evt, saga, callback) {

    console.log('Hiee! I reached in Saga')

    saga.set('orderId', 1234);
    saga.set('totalCosts', 5678);
});
// or
// saga.set({ orderId: evt.aggregate.id, totalCosts: evt.payload.totalCosts });

/*var cmd = {

 // if you don't pass an id it will generate a new one
 id: 'my own command id',
 name: 'makeReservation',
 aggregate: {
 name: 'reservation'
 },
 context: {
 name: 'sale'
 },
 payload: {
 transactionId: saga.id,
 seats: saga.has('seats') ? saga.get('seats') : evt.payload.seats
 },

 // to transport meta infos (like userId)...
 // if not defined, it will use the meta value of the event
 meta: evt.meta
 };*/

//saga.addCommandToSend(cmd);

// optionally define a timeout
// this can be useful if you have an other process that will fetch timeouted sagas
/*    var tomorrow = new Date();
 tomorrow.setDate((new Date()).getDate() + 1);
 var timeoutCmd = {

 // if you don't pass an id it will generate a new one
 id: 'my own command id',
 name: 'cancelOrder',
 aggregate: {
 name: 'order',
 id: evt.aggregate.id
 },
 context: {
 name: 'sale'
 },
 payload: {
 transactionId: saga.id
 },

 // to transport meta infos (like userId)...
 // if not defined, it will use the meta value of the event
 meta: evt.meta
 };*/
//saga.defineTimeout(tomorrow, [timeoutCmd]);
// or
// saga.defineTimeout(tomorrow, timeoutCmd);
// or
// saga.defineTimeout(tomorrow);

//saga.commit(callback);
//});
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

