const express = require('express');
const router = express.Router();
const path = require('path');

const multer = require('multer');
const upload = multer({ dest: process.cwd() + path.sep + 'public' + path.sep + 'images' })

const client = require('../services/redis');
const queue = require('../services/queue');
const logger = require('../utils/logger');


router.get('/:id/thumbnail', function(req, res, next) {
  return client.getAsync(req.params.id).then(data => {
    if (data !== null) {
      res.json({ url: data })
    } else {
      // Returns 404
      res.boom.notFound('ID not found. Please try later!');
    }
  })
});

router.post('/', upload.single('image'), function(req, res, next) {
  // Create image job
  queue.create('image', {
    filename: req.file.filename,
    extension: 'jpg'
  })
  .removeOnComplete(true) // Remove job from queue if completed.
  .attempts(5)  // Max retries for the job
  .backoff({delay: 60*1000, type:'exponential'}) // Time between retries.
  .save() // Save to db.
  .on('complete', function(result){
    logger.info(`Job completed with data ${result}`);
  }).on('progress', function(progress, data){
    logger.info(`\r  job #${job.id} ${progress}% complete with data ${data}`);
  
  }).on('failed', function(err){ // Huh?
    logger.error(`Job failed: ${err}`);
  });

  // Set empty value for ID.
  client.setAsync(req.file.filename, '')

  // Send status 200 with ID for image.
  res.json(req.file);
});

module.exports = router;
