const kue = require('kue');
const queue = kue.createQueue({
  redis: 'redis://cache:6379',
});

module.exports = queue;
