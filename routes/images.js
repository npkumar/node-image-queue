var express = require('express');
var router = express.Router();

const client = require('../services/redis');
var multer = require('multer');
const upload = multer({ dest: './uploads/' })
const im = require('imagemagick');
const sharp = require('sharp');

router.get('/:id/thumbnail', function(req, res, next) {
  return client.getAsync(req.params.id).then(data => {
    if (data !== null) {
      res.send(data);
    } else {
      res.boom.notFound('ID not found!');
    }
  })
});

router.post('/', upload.single('image'), function(req, res, next) {
  res.json(req.file);
});

module.exports = router;
