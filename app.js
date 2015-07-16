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
var app =express();
var server = app.listen(8080);
var client = require('socket.io').listen(server).sockets;
var helpers = require('express-helpers')(app); //automatically includes all view-helpers



//database setupstat
mongoose.connect('mongodb://localhost/sekanevamwe');
var db = mongoose.connection; //this creates a db instance

db.on('error',function(){
    console.log("Failed to connect to Sekanevamwe database ...");
});


db.once('open',function(){
    console.log("Successfully connected to Sekanevamwe database ...");
    client.on('connection',function(socket){
      socket.on('like',function(data){      
      var joke_id=data.joke_id;
      var user_id=data.user_id;     
      Joke.findOne({_id:joke_id},function(err,joke){  

          if(joke){

            if(joke.likes.indexOf(user_id)===-1){ //check for the person liking no the joke id              
              joke.likes.push(user_id);
                joke.save(function(err,joke){
                  if(!err){                         
                    client.emit('like_update',{joke:joke});//send back like update
                  }else{
                    client.emit('error',{error:"joke couldn't be saved"});
                  }
                });
            }else{
              client.emit('already_liked_the_joke',{joke:joke});
            }
          }else{             
            client.emit('error',{error:"joke couldn't be found"});
          }
        });

      }); 

    socket.on('comment',function(data){
      
        var author_id = data.author_id;
        var joke_id = data.joke_id;
        var content = data.content;
        var created_at = Date.now();
        var new_comment = new Comment({
          author: author_id,
          content: content,
          joke_id : joke_id,
          created_at: created_at,
          });

       
          new_comment.save(function(err,comment){
            if(err){             
              client.emit('error',{error:"couldn't save comment"});
            }else{ 
              //on success add the comment id in the Joke comments
              
              Joke.findOne(joke_id,function(err,joke){
                if(!err){
                  joke.comments.push(comment.id);
                  client.emit('new_comment',{message:"comment successfully created", comment : comment, joke_comments:joke.comments});
                }else{
                  client.emit('error',{error:"couldn't find joke"});
                }
              });             
            }
          });
        });
      });
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
module.exports = app;
