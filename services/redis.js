const redis = require('redis');
const bluebird = require('bluebird');

const client = bluebird.promisifyAll(redis).createClient('redis://cache:6379');

// Export promisified redis client.
module.exports = client;
