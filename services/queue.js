const kue = require('kue');

const client = require('../services/redis');
const logger = require('../utils/logger');
const util = require('../utils/util');
const resizeImage = require('../utils/resize');

const queue = kue.createQueue({redis: process.env.REDIS_URL});

const JOB_PROCESSING_CONCURRENCY = 2; // To be decided by actual usage.
const JOB_FAILURE_ATTEMPTS = 2; // Max retries for the job
const JOB_FAILURE_BACKOFF_DELAY = 30 * 1000; // Re-attempt delay duration.

module.exports = {

  /**
 * Creates and adds job of type `image` to worker queue.
 *
 * @param {String} filename Image name without extension.
 * @param {String} extension Extension of image. Eg. jpg.
 */
  createJob: (filename, extension) => {
    logger.info(`Creating a job for image ${filename}`);

    queue.create('image', {filename, extension})
      .removeOnComplete(true) // Remove job from queue if completed.
      .attempts(JOB_FAILURE_ATTEMPTS)
      .backoff({delay: JOB_FAILURE_BACKOFF_DELAY, type: 'exponential'})
      .save()
      .on('complete', result => logger.info(`Job completed with data ${result}`))
      .on('progress', (progress, data) => logger.info(`\r  job #${job.id} ${progress}% complete with data ${data}`))
      .on('failed', err => logger.error(`Job failed: ${err}`));
  },

  /**
   * Processes jobs found in queue.
   */
  processJob: () => {
    queue.process('image', JOB_PROCESSING_CONCURRENCY, (job, done) => {
      logger.info(`Processing job for image id: ${job.data.filename}`);

      const {filename, extension} = job.data;
      resizeImage(filename, extension)
        .then(() => {
          logger.info(`Resized image with id: ${filename}`);

          // Remove uploaded file post processing.
          util.unlinkSync(filename, extension);

          // Post successful resize set download path as key value.
          return client.setAsync(filename, util.getFileDownloadPath(filename));
        })
        .catch(({message}) => {
          logger.error(message);

          // Register back a failed attempt.
          return done(new Error(JSON.stringify(err)));
        });
    });
  },
};
