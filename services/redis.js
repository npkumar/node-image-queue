const redis = require('redis');
const bluebird = require('bluebird');

const client = bluebird.promisifyAll(redis).createClient(process.env.REDIS_URL);

// Export promisified redis client.
module.exports = client;
