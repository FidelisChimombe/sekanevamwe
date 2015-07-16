/**
* Handles authentication
*Takes care of Registration, Login and Logout
*/
var express = require('express');
var mongoose = require('mongoose');
var async = require('async');
var bcrypt = require('bcrypt');
var custom_validator = require('./../utils/custom_validator.js');
var response = require('./../utils/response.js');
var User = require('./../models/user');
var Joke = require('./../models/joke');
var Comment = require('./../models/comment');
var nodemailer = require('nodemailer');
var jwt = require('jwt-simple');
var user_controller= {};
var secret = 'gwindingwi_rineshumba_gonawapotera';

user_controller.register = function(req,res){
  //register POST
  //TODO Make functional call async if it's worth it
  //TODO look at the username
  //validating the input from the client. Here the code makes no assumptions that
  //the client will validate the input itself
  /*var errors = custom_validator.validate(req.body);
  if (errors.length != 0){
    return;
  }*/

  //attempt to register the user 
  
  var link = 'http://'+ req.headers.host +'/users/validate?uniqueIdentifier=' // link to confirm account
  async.waterfall(
    [ //Validate the user input
    //remember to correct the req.query
      function(callback){
        
        var errors = custom_validator.validate(req.body);
        if (errors.length != 0){
          
          callback(errors);
        } else {
          
          callback(null);
        }
      },
      //Find if the use exists
      function(callback){
        
        User.findOne({"username": req.body.username}, function(err, user){
          if (err){
            
            callback(err);
          }
          else if (user){
            
            callback("Username already exists");
          } else{
            //the user has not been found, and signalling that no error has
            //happened3333333333333
           
            callback(null);
          }
        });
      },
      //Create a salt
      function(callback){
        

        //callback is called with (err, salt)
        bcrypt.genSalt(10, callback)
      },
      //Hash the password and salt
      function(salt, callback){
        //callback is called with (err, encypted)
        bcrypt.hash(req.body.password, salt, callback);
        
      },
      //Save the use in the database
      function(password_hash, callback){
        
         
        var new_user = {

          "email": req.body.email,
          "password_hash": password_hash,          
          // "mutupo" : req.body.mutupo,         
          "username":req.body.username.toLowerCase(),
          "created_at": Date.now(),
          "account_confirmed": false
        }


        User.create(new_user, function (err, user) {
          //TODO Send appropriate messages
          if (err){
            callback(err);
          } else if(user){
            //generate token for this user
            var payload ={id:user.id};            
            var token = jwt.encode(payload,secret);
            link = link+ token;
            callback(null, {
              "success": true,
              "message": "Registration successfull"              
            });
          } else{
            callback("Serious stuff has happened if we reach here");
          }
          //res.send('respond with a resource1');
        });
      }
    ],
    function(err, results){
      //TODO send to custom package for responses
      if (err){
        if (!Array.isArray(err))
          err = [err];
        //message, HTTP code
        response.failure(res, err, 200);
      }
      else
        //message, data, HTTP code
        user_controller.email_user(req.body.email,"Hello "+req.body.username + "<br><br><br> Please Click on the link to verify your email.<br><a href="+link+">"+"Click here to verify</a><br><br><br> Ngatisekei Vakomana nevasikana <br><br><br> Sekanevamwe Team","Confirm Account",req,res); 
    });
};

var transporter = nodemailer.createTransport({
  service : 'Gmail',
  auth : {
    user:'beaverlist@gmail.com',
    pass:"mitbeaver2014"
  }
});

/*Sends an email to the user on behalf of us
*TODO add the page to be redirected after a successful message sending
*/
user_controller.email_user = function(useremail,content, subject,req,res){
  var emailoptions = {
    from: 'beaverlist@gmail.com',
    to: useremail,
    subject:subject,
    html:content
  }

  transporter.sendMail(emailoptions,function(error,info){
    if(error){
      res.render('error',{error:"failed to send email", message:"message sending failed"});
    }else{  

      //but send a flash telling the user to confirm their account 
      Joke.find({level:"regular"}).sort('-created_at').exec(function(err,jokes){
            if(!err){
                Joke.populate(jokes,{path:'author'},function(err,jokes){
                  if(!err){
                    res.render('jokes/regular',{title: "Regular Jokes", jokes:jokes,user:req.user});
                  }else{
                    res.render('error');
                  }
                });
            }else{
                res.render('error');
            }
          }); 
      // res.render('jokes/regular',{title:"Email Confirmation"});
      // response.success(res, "Confirmation email was sent successful", null, 200);  
           
    }
  });
}


/*
*validate helps validate that a the person who created an account owns the email address
*receives the account confirmation token from the owner of the email address
*/
user_controller.validate_email = function(req,res){
  var token = req.query.uniqueIdentifier;  
  if(typeof token === "object"){ //sanitization of the inputs
    token = JSON.stringify(encrypted_code);
  }
  var decoded = jwt.decode(token,secret);//getting back the user id from the ecrypted id
  var user_id =decoded;
  User.findById(user_id.id,function(err,user){
    if(!err){
      user.account_confirmed = true;
      user.save(function(err,user){
        if(!err){
          // console.log("The accounting has been confirmed");
          // response.success(res, "Your account has been successfully confirmed, batai mbabvu tiseke", null, 200);
          // var regular_jokes =Joke.jokes("regular");
          // if(regular_jokes.jokes!=undefined){
          //     res.render('jokes/regular',{title: "Regular Jokes", jokes:regular_jokes.jokes}); //the defaulut jokes to be returned are the regular jokes because they harm nobody
          // }else{
          //     res.render('error');
          // }
          Joke.find({level:"regular"}).sort('-created_at').exec(function(err,jokes){
            if(!err){
                Joke.populate(jokes,{path:'author'},function(err,jokes){
                  if(!err){
                    res.render('jokes/regular',{title: "Regular Jokes", jokes:jokes,user:req.user});
                  }else{
                    res.render('error');
                  }
                });
                
            }else{
                res.render('error');
            }
          });
        }else{
          // response.failure(res, "couldn't confirm the account", null, 401);
          res.render('error',{error:"Couldn't confirm your account"});
        }
      });
    }else{
      res.render('error',{error:"Couldn't confirm your account"});
    }
  });


}

/*Features

laughing groups
Following
Facebook and Twitter share features [Conclude by saying sekanevamwe]
Hash Tags
Joke Categorization [Chinotimba Jokes]
Jokes with images
Meme Jokes
Statistics features for the sake of data, prolly integrate google analytics
Messaging
Enable Video Sharing
Implement Features which go along with social trends in Zimbabwe

*/

//user's profile
user_controller.profile = function(req,res){ 
var user_id = req.params.id;// adding an extra layer for checking that the person re
  User.findOne({_id:req.user.id},function(err,user){  
    if(!err){
      res.render("users/my_profile",{title: "Profile",user:req.user}); //with time , add more information about the user e.g friends, jokes, comments, sando
    }else{
      res.render('error');
    }
  });
}

//edit profile
//update profile



module.exports = user_controller;
