var express = require('express');
var router = express.Router();
var User = require('./../models/user');
var Joke = require('./../models/joke');
var Comment = require('./../models/comment');

/* GET home page. */
router.get('/', function(req, res) {  
  res.render('jokes/regular', { title: 'Sekanevamwe', what: 'best', who: 'me',title:"Regular Jokes" });
});

module.exports = router;
