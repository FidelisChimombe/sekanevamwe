var express = require('express');
var router = express.Router();
var User = require('./../models/user');
var Joke = require('./../models/joke');
var Comment = require('./../models/comment');

/* GET home page. */
router.get('/', function(req, res) { 
  Joke.find({level:"regular"}).sort('-created_at').exec(function(err,jokes){
    if(!err){
      Joke.populate(jokes,{path:'author'},function(err,jokes){
        if(!err){
           res.render('jokes/regular', { title: 'Sekanevamwe', what: 'best', who: 'me',title:"Regular Jokes",jokes:jokes,user:req.user});
        }else{
          res.render('error');
        }
      });
     
    }else{
      res.render('error');
    }
  }); 
  
});

module.exports = router;
