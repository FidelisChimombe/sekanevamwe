var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var passport = require('passport');
var methodOverride = require('method-override');
var engine = require('ejs-mate');
var moment = require('moment');
var timeago = require('timeago');
var User = require('./models/user');
var Joke = require('./models/joke');
var Comment = require('./models/comment');
var http = require('http');
var app =express();

var helpers = require('express-helpers')(app); //automatically includes all view-helpers






// var server = app.listen(3000);
// var client = require('socket.io').listen(server);




var connection_string = 'mongodb://localhost:27017/sekanevamwe-database';

// if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
//         connection_string = 'mongodb://' + 
//         process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':' +
//         process.env.OPENSHIFT_MONGODB_DB_PASSWORD + '@' +
//         process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
//         process.env.OPENSHIFT_MONGODB_DB_PORT + '/sekanevamwe-database';
// }


//database setupstat
mongoose.connect(connection_string);
var db = mongoose.connection; //this creates a db instance


db.on('error',function(msg){
    console.log("Failed to connect to Sekanevamwe database ...",msg);
});


db.once('open',function(){
    console.log("Successfully connected to Sekanevamwe database ...");
 
    });

// view engine setup
app.engine('ejs',engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(cookieParser());
app.use(session({
            secret:'very secretive', 
            store : new mongoStore({
                 mongooseConnection: db//supposed to connect to the instance of the db// put all connections you want to go to the db
            

            }),
             saveUninitialized : true,
             resave : true
         }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
moment().format();


//Routing
var routes = require('./routes/index');
var users = require('./routes/users');
var jokes = require('./routes/jokes');
var comments = require('./routes/comments');


//Direct certain urls to the correct place
app.use('/', routes);
app.use('/users', users);
app.use('/jokes', jokes);
app.use('/comments', comments);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var port = process.env.OPENSHIFT_NODEJS_PORT;
var ip = process.env.OPENSHIFT_NODEJS_IP;


app.listen(port || 3000, ip);
//module.exports = app;
