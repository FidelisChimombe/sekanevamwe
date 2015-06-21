var express = require('express');
var passport = require('passport');
var router = express.Router();
var user_controller=require('./../controllers/users');
var response = require('./../utils/response.js');
var User = require('./../models/user');
require('./../utils/auth.js');




/*
upon successful authentication, a session will be established and maintained via a cookie set in the browser
Each subsequent request will not contain credentials, but rather the unique cookie that identifies the session
In order to support login sessions, Passport will serialize and deserialize user instances to and from the session.
to access the user, just do req.user
*/
passport.serializeUser(function(user, done) {
  done(null, user.id);
  //when other requests are made, id is used to find the user
  //only the user ID is serialized to the session, keeping the amount of data stored within the session small. 
  //When subsequent requests are received, this ID is used to find the user, which will be restored to req.user.
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});



//registers a new user into the system
router.post('/register',function(req,res){
  console.log("The request has just been received");
  user_controller.register(req,res);
});



//logs in a user into the system
router.post('/login',passport.authenticate('local',{session:true, failureRedirect: '/users/login', successFlash: 'Welcome!'}),function(req,res){
  //redirect the user with to the right page, since this is a one page application, will return json data to the client
  //wanna send something back to the server
  res.json({message:"zvaita"});
 
});

router.get('/login',function(req,res){ 
 res.render('login', { title: 'Express' });
});
  

  //response.success(res,"The login was successful", req.user, 200); //req.user will give the client the user object to the client


//logs out a user out of the system
// router.post('/login',
//   passport.authenticate('local', { successRedirect: '/',
//                                    failureRedirect: '/login',
//                                    failureFlash: true })
// );

router.get('/logout',function(req,res){ 
  req.logout();
  res.redirect();
});

//validates the email address of the account owner
router.get('/validate',function(req,res){
  user_controller.validate_email(req,res);
});

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});


 

// router.get('/:username',function(req,res){
//   user_controller.profile(req,res);
// });
module.exports = router;
