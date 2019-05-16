const path = require('path');
const uuid = require('uuidv4');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, `${process.cwd() + path.sep }public${ path.sep }images`),
  filename: (req, file, cb) => {
    const extension = file.mimetype.split('/')[1];
    cb(null, `${uuid()}.${extension}`);
  },
});

module.exports = multer({storage});
