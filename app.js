var express = require('express');
var boom = require('express-boom');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var imagesRouter = require('./routes/images');
var bb = require('express-busboy');

var app = express();
// bb.extend(app, {
//   upload: true,
//   path: './uploads/',
//   allowedPath: /./
// });
app.use(boom());


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/image', imagesRouter);

module.exports = app;
