require('rootpath')();
require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('express-jwt');
var logger = require('morgan');
var cors = require('cors');
var helmet = require('helmet');
var mongoose = require('mongoose');
var compression = require('compression');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(helmet());
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());  // compress all responses

/**
 * Establish Database connection
 */
var dbConnectionString = process.env.CONNECTION_STRING;
mongoose.connect(dbConnectionString, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB connection error:'));
db.once('open', function (err) {
    if (err) {
        process.exit(1);
        return console.log(err);
    }
    console.log('Local DB connected');
});

/**
 * Listen on HTTP_PORT
 */
http.listen(process.env.HTTP_PORT, function () {
    console.log('API Server listening on ' + process.env.HTTP_PORT);
});

/** 
 * Establish Socket.io 
 */
io.on('connection', function (socket) {
    
    console.log('Socket connected');

    // Socket event handlers
    socket.on('disconnect', function () {
        console.log('Socket disconnected');
    });

    socket.on('message', function () {
        console.log('message received');
        io.emit('response', 'response emitted');
    });

});

/** 
 * Handle app termination signal
 */
process.on('SIGINT', function () {
    // Close Socket.io
    io.close();
    
    // Close the DB connection
    mongoose.connection.close(function () {
        console.log('DB disconnected');
        process.exit(0);
    });
});


/**
 * Import Controllers
 */
var boloController = require('./controllers/bolo.controller.js');
var broadcastController = require('./controllers/broadcast.controller.js');
var authenticationController = require('./controllers/authentication.controller.js');
var userController = require('./controllers/user.controller.js');

/** Initialise authentication */
var authenticate = jwt({
    secret: process.env.OAUTH_CLIENT_SECRET,
    audience: process.env.OAUTH_CLIENT_ID
});

/**
 * Application Routes
 */
app.use('/api/v1/authentication', authenticationController);
app.use('/api/v1/bolos', authenticate, boloController);
app.use('/api/v1/broadcasts', authenticate, broadcastController);
app.use('/api/v1/users', authenticate, userController);
