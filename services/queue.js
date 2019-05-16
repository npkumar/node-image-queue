const sharp = require('sharp');
const fs = require('fs');
const kue = require('kue');
const client = require('../services/redis');
const logger = require('../utils/logger');
const util = require('../utils/util');
const queue = kue.createQueue({redis: 'redis://cache:6379'});

const setResizedImagePath = (job, done) => {
  const {filename, extension} = job.data;
  resizeImage(filename, extension)
    .then(data => {
      logger.info(`Resized image with id: ${filename}`);
      logger.info(data);

      try {
        fs.unlinkSync(util.getUploadPath(filename, extension));
      } catch ({message}) {
        logger.error(message);
      }

      return client.setAsync(filename, util.getFileDownloadPath(filename));
    })
    .catch(({message}) => {
      logger.error(message);

      // Register back a failed attempt.
      return done(new Error(JSON.stringify(err)));
    });
};


const resizeImage = (filename, extension) => {
  return sharp(util.getUploadPath(filename, extension))
    .resize({width: 100, height: 100})
    .toFile(util.getUploadResizedPath(filename));
};

module.exports = {
  createJob: (filename, extension) => {
    logger.info(`Creating a job for image ${filename}`);

    queue.create('image', {filename, extension})
      .removeOnComplete(true) // Remove job from queue if completed.
      .attempts(5) // Max retries for the job
      .backoff({delay: 60*1000, type: 'exponential'}) // re-attempt delay.
      .save() // Save to redis.
      .on('complete', result => logger.info(`Job completed with data ${result}`))
      .on('progress', (progress, data) => logger.info(`\r  job #${job.id} ${progress}% complete with data ${data}`))
      .on('failed', err => logger.error(`Job failed: ${err}`));
  },

  processJob: () => {
    queue.process('image', 1, (job, done) => {
      logger.info(`Processing job for image id: ${job.data.filename}`);
      setResizedImagePath(job, done);
    });
  },
};
