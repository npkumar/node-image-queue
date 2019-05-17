const sharp = require('sharp');
const util = require('./util');

/**
 * Resize an image using sharp library.
 * @see http://sharp.pixelplumbing.com/en/stable/api-resize/
 * jpeg/jpg to png conversion works.
 *
 * @param {String} filename Image name without extension.
 * @param {String} extension Extension of image. Eg. jpg.
 *
 * @return {Promise}
 */
const resizeImage = (filename, extension) => {
  return sharp(util.getUploadPath(filename, extension))
    .resize({width: 100, height: 100})
    .toFile(util.getUploadResizedPath(filename)); // Output format inferred from extension.
};

module.exports = resizeImage;
