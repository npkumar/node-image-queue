const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis);

const client = redis.createClient({
  host: '34.201.46.162', port: 12167, password: 'Xqbu1d3ERFQKwfYPPdfWHCYEfwszBeL7'
 })

module.exports = client;
