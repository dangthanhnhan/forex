var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')
var fileUpload = require('express-fileupload');

var databaseMiddleware = require('./middlewares/database');
var routerMiddleware = require('./middlewares/router');
var responseMiddleware = require('./middlewares/response');
var authenticationMiddleware = require('./middlewares/authentication');

var app = express();

app.rootDir = __dirname;

var config = require('./private/config')(app.get('env'));

// view engine setup
app.set('views', path.join(app.rootDir, 'views'));
app.set('view engine', 'ejs');

// global variable
app.set('config', config);

// configuration session
app.use(session(config.session));

// uncomment after placing your favicon in /public
app.use(favicon(path.join(app.rootDir, 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(app.rootDir, 'public')));

// Middleware Before Request
app.use(routerMiddleware(app));
app.use(databaseMiddleware(app));
app.use(authenticationMiddleware(app));
app.use(responseMiddleware(app));

// Add router
var routes = require('./routes')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    if (err.status == 401) {
        res.redirect('/'+ req.module +'/login');
    } else if (err.status == 404) {
        res.render('notfound');
    } else {
        // render the error page
        res.status(err.status || 500);
        res.render('error');
    }
});

module.exports = app;
