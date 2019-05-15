const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const queue = require('../services/queue');
const client = require('../services/redis');
const logger = require('../utils/logger');

queue.process('image', 1, (job, done) => {
  logger.info(`Processing job for image id: ${job.data.filename}`);
  setResizedImagePath(job, done);
});

const setResizedImagePath = (job, done) => {
  resizeImage(job.data.filename, job.data.extension)
    .then(data => {
      logger.info(`Resized image with id: ${job.data.filename}`);
      logger.info(data);

      try {
        fs.unlinkSync(
          `${process.cwd() + path.sep }public${ path.sep }images${ path.sep }${job.data.filename}`
        );
      } catch (err) {
        logger.error(err);
      }

      return client.setAsync(
        job.data.filename, `localhost:3000/images/resized/${ job.data.filename }.${ job.data.extension}`
      );
    })
    .catch(err => {
      logger.error(err);

      // Register back a failed attempt.
      return done(new Error(JSON.stringify(err)));
    });
};


const resizeImage = (filename, extension) => {
  return sharp(
    `${process.cwd() + path.sep }public${ path.sep }images${ path.sep }${filename}`
  )
    .resize({width: 100, height: 100})
    .toFile(
      `${process.cwd() + path.sep }public${ path.sep }images${ path.sep }resized${ path.sep }${filename }.${ extension}`
    );
};
