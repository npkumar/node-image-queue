var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:id/thumbnail', function(req, res, next) {
  res.send('You provided: ' + req.params.id);
});

router.post('/', function(req, res, next) {
  console.log(req.body)
  res.send('You provided: ' + req.body.id);
});

module.exports = router;
