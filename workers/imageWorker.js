const sharp = require('sharp');
const fs = require('fs');
const queue = require('../services/queue');
const client = require('../services/redis');
const logger = require('../utils/logger');
const util = require('../utils/util');

queue.process('image', 1, (job, done) => {
  logger.info(`Processing job for image id: ${job.data.filename}`);
  setResizedImagePath(job, done);
});

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
