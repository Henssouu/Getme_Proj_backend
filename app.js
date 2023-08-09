require('dotenv').config();
require('./models/connection');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var animauxRouter = require('./routes/animaux');
const messageRouter = require('./routes/messages');
const wantedNoticesRouter = require('./routes/wantedNotice');
var postsRouter = require('./routes/posts');
var app = express();
const cors = require('cors');
app.use(cors());
const fileUpload = require('express-fileupload');
app.use(fileUpload());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/animaux', animauxRouter);
app.use('/api/messages', messageRouter);
app.use('/api/wanted-notices', wantedNoticesRouter);
app.use('/posts', postsRouter);

module.exports = app;
