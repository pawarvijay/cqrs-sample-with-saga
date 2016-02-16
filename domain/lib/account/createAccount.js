module.exports = require('cqrs-domain').defineCommand({
  name: 'createAcccount'
}, function (data, aggregate) {
  aggregate.apply('accountCreated', data);
});