var express = require('express');
var boom = require('express-boom');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var imagesRouter = require('./routes/images');

const app = express();

// Middlewares
app.use(boom());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routers
app.use('/image', imagesRouter);

module.exports = app;
