const express = require('express');
const router = express.Router();
const BPromise = require('bluebird');

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
 * @apiSuccess 202 Accepted. Image is being processed.
 *
 * @apiError 404 Request image Id is not found.
 * @apiError 500 Server error.
 */
router.get('/:id/thumbnail', (req, res) => {
  const imageId = req.params.id;
  return client.getAsync(imageId)
    .then(data => {
      if (data === null) {
        throw new Error('ImageIDNotFound');
      } else if (data === '') {
        throw new Error('ImageBeingProcessed');
      } else {
        res.json({url: data});
      }
    })
    .catch(({message}) => {
      if (message === 'ImageIDNotFound') {
        // Returns 404
        logger.debug(`Image ID ${imageId} not found!`);
        return res.boom.notFound(`Image ID ${imageId} not found!`);
      } else if (message === 'ImageBeingProcessed') {
        // Accepted. But image is not ready yet.
        const errorResponse =`Image ${imageId} is being processed. Please try again later!`;
        logger.debug(errorResponse);
        return res.status(202).json({
          message: errorResponse,
        });
      }
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
 * @apiError 400 ImageNotFound Bad request, need to attach an image.
 * @apiError 500 Server error.
 */
router.post('/', upload.single('image'), (req, res) => {
  let filename;
  let extension;

  return BPromise.try(() => {
    if (req.file === undefined) {
      throw new Error('ImageNotFound');
    }

    [filename, extension] = req.file.filename.split('.');
  })
    // Create an image job
    .then(() => queue.createJob(filename, extension))
    // Set empty value for ID. This indicates that image is being processed.
    .then(() => client.setAsync(filename, ''))
    .then(() => res.json({id: filename}))
    .catch(({message}) => {
      logger.error(message);
      if (message === 'ImageNotFound') {
        return res.boom.badRequest('Please attach an image');
      }

      // Respond with 500 internal error
      res.boom.badImplementation(message);
    });
});

module.exports = router;
