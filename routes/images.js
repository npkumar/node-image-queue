const express = require('express');
const router = express.Router();

const client = require('../services/redis');
const queue = require('../services/queue');
const upload = require('../services/upload');
const logger = require('../utils/logger');

/**
 * @api {get} /image/:id/thumbnail Request PNG thumbnail version of an image
 *
 * @apiParam {Number} id Image unique ID.
 *
 * @apiSuccess {Object}  data           PNG thumbnail information.
 * @apiSuccess {String}  data.url       Public access url of thumbnail image.
 *
 * @apiSuccess {Object}  data           PNG thumbnail information.
 * @apiSuccess {String}  data.message   Image is still being processed. Status message.
 *
 * @apiError 404 Request image Id is not found.
 * @apiError 500 Server error.
 */
router.get('/:id/thumbnail', (req, res) => {
  const imageId = req.params.id;
  return client.getAsync(imageId)
    .then(data => {
      if (data === null) {
        // Returns 404
        logger.debug(`Image ID ${imageId} not found!`);
        res.boom.notFound(`Image ID ${imageId} not found!`);
      } else if (data === '') {
        // Accepted. But image is not ready yet.
        logger.debug(`Image ${imageId} is being processed. Please try again later!`);
        res.status(202).json({
          message: `Image ${imageId} is being processed. Please try again later!`,
        });
      } else {
        res.json({url: data});
      }
    })
    .catch(({message}) => {
      // Respond with 500 internal error
      logger.error(message);
      res.boom.badImplementation(message);
    });
});

/**
 * @api {post} /image/ Sumbit an image for processing to PNG thumbnail
 *
 * @apiParam {String} image Image file attached as form data.
 *
 * @apiSuccess {Object}  data      PNG thumbnail information.
 * @apiSuccess {String}  data.id   Unique ID to fetch thumbnail information.
 *
 * @apiError 500 Server error.
 */
router.post('/', upload.single('image'), (req, res) => {
  const [filename, extension] = req.file.filename.split('.');
  try {
    // Create an image job
    queue.createJob(filename, extension);

    // Set empty value for ID. This indicates that image is being processed.
    client.setAsync(filename, '');
  } catch ({message}) {
    // Respond with 500 internal error
    logger.error(message);
    res.boom.badImplementation(message);
  }

  // Send status 200 with ID for image.
  res.json({id: filename});
});

module.exports = router;
