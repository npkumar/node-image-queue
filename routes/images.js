const express = require('express');
const router = express.Router();
const path = require('path');

const multer = require('multer');
const upload = multer({
  dest: `${process.cwd() + path.sep }public${ path.sep }images`,
});

const client = require('../services/redis');
const queue = require('../services/queue');
const logger = require('../utils/logger');

/**
 *
 */
router.get('/:id/thumbnail', (req, res) => {
  return client.getAsync(req.params.id)
    .then(data => {
      if (data === null) {
        // Returns 404
        res.boom.notFound('ID not found. Please try later!');
      } else if (data === '') {
        // Accepted. But image is not ready yet.
        res.status(202).json({
          message: 'Image is being processed. Please try again later!',
        });
      } else {
        res.json({url: data});
      }
    })
    .catch(err => {
      // Respond with 500 internal error
      res.boom.badImplementation(err.message);
    });
});

/**
 *
 */
router.post('/', upload.single('image'), (req, res) => {
  try {
    // Create an image job
    queue.create('image', {
      filename: req.file.filename,
      extension: 'jpg',
    })
      .removeOnComplete(true) // Remove job from queue if completed.
      .attempts(5) // Max retries for the job
      .backoff({delay: 60*1000, type: 'exponential'})
      .save() // Save to redis.
      .on('complete', result => logger.info(`Job completed with data ${result}`))
      .on('progress', (progress, data) => logger.info(`\r  job #${job.id} ${progress}% complete with data ${data}`))
      .on('failed', err => logger.error(`Job failed: ${err}`));

    // Set empty value for ID. This indicates that image is being processed.
    client.setAsync(req.file.filename, '');
  } catch (err) {
    // Respond with 500 internal error
    res.boom.badImplementation(err.message);
  }

  // Send status 200 with ID for image.
  res.json({id: req.file.filename});
});

module.exports = router;
