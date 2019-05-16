const path = require('path');

const util = {
  getUploadPath: (filename, extension) => {
    return `${ process.cwd() }${ path.sep }public${ path.sep }images${ path.sep }${filename}.${extension}`;
  },

  getUploadResizedPath: filename => {
    return `${ process.cwd() }${ path.sep }public${ path.sep }images${ path.sep }resized${ path.sep }${filename }.png`;
  },

  getFileDownloadPath: filename => `localhost:3000/images/resized/${ filename }.png`,
};

module.exports = util;
