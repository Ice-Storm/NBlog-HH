var express = require('express');

var path = require('path');

var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');

var session = require('express-session');

var logger = require('morgan');

var route = require('./route/routes.js');

var config = require('./config.default.js');

var middlewaresAuth = require('./middlewares/auth.js');

var middlewaresLimit = require('./middlewares/limit.js');

var log4js = require('log4js');


/*
 * config
 */
 
 var app = express();
 
 app.set('views', path.join(__dirname, 'views'));
 
 app.set('view engine', 'html');

 app.engine('html', require('ejs').__express);


 app.use(logger('dev'));
 
 app.use(bodyParser());
 
 app.use(cookieParser());
 
 app.use(session({
    secret: config.sessionSecret
 }));


log4js.configure(config.log4js);


/*var logger = log4js.getLogger('normal');
logger.setLevel(config.log4jsLeave);

app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));*/

// session超时登出

 app.use(middlewaresAuth.freshSession);

 app.use(middlewaresLimit.limitPost);
 
 app.use(express.static(path.join(__dirname, 'public')));
 
 var router = express.Router();
 
 app.use('/', router);

 route(router)

 module.exports.app = app;

 app.listen(config.listenerPort);