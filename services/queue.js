const kue = require('kue');
const queue = kue.createQueue({redis: 'redis://cache:6379'});

// Export worker Queue.
module.exports = queue;
