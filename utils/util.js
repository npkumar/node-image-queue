const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

const util = {
  /**
   * Get path to upload a given image file.
   *
   * @param {String} filename Filename.
   * @param {String} extension File extension.
   * @return {String} File path to uploaded image.
   */
  getUploadPath: (filename, extension) => {
    return `${process.cwd()}${path.sep}public${path.sep}images${path.sep}${filename}.${extension}`;
  },

  /**
   * Get path to resized png image post processing.
   *
   * @param {String} id ID provided for uploaded file
   * @return {String} File path to processed image.
   */
  getUploadResizedPath: id => {
    return `${process.cwd()}${path.sep}public${path.sep}images${path.sep}resized${path.sep}${id}.png`;
  },

  /**
   * Get path to resized image post processing.
   *
   * @param {String} id ID provided for uploaded file
   * @return {String} Server URL path to processed image with png extension.
   */
  getFileDownloadPath: id => `localhost:3000/images/resized/${ id }.png`,

  /**
   * Synchrnously delete a file.
   *
   * @param {String} filename Image name without extension.
   * @param {String} extension Extension of image. Eg. jpg.
   */
  unlinkSync: (filename, extension) => {
    try {
      // Remove uploaded file post processing.
      fs.unlinkSync(util.getUploadPath(filename, extension));
    } catch ({message}) {
      logger.error(message);
    }
  },
};

// Export utility functions.
module.exports = util;
