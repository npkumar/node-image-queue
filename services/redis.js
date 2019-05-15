const redis = require('redis');
const bluebird = require('bluebird');

const client = bluebird.promisifyAll(redis).createClient('redis://cache:6379');

module.exports = client;
