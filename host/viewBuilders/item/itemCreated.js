module.exports = require('cqrs-eventdenormalizer').defineViewBuilder({
  name: 'itemCreated',
  aggregate: 'item',
  id: 'payload.id'
}, 'create');