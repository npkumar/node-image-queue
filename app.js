const express = require('express');
const boom = require('express-boom');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const imagesRouter = require('./routes/images');

const app = express();

// Middlewares
app.use(boom());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routers
app.use('/image', imagesRouter);

module.exports = app;
