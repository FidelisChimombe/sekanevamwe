/**
* Authentication configuration and handling
*/
var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var User = require('./../models/user');


//username-password based authentication
//strategies and their configuration are supplied via use()
//console.log("Trying to authenticate");

passport.use(new LocalStrategy({
    usernameField: "username",
    passwordField: "password"
  },
  function(username, password, done) {
    
    User.findOne({ username: username.toLowerCase()}, function (err, user) {
      
      if (err) { return done(err); }
      if (!user) {
        console.log("Incorrect Username");
        done(null, false, { message: 'Incorrect username.' });
      }else{
      user.validatePassword(password,done);
    }
     
    });
  }
));