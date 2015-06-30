var express = require('express');
var passport = require('passport');
var router = express.Router();
var comment_controller=require('./../controllers/comments');
var response = require('./../utils/response.js');
var User = require('./../models/user');
require('./../utils/auth.js');


router.post('/new_comment',function(req,res){
  comment_controller.new_comment(req,res);
});

router.post('/delete_comment',function(req,res){
  comment_controller.delete_comment(req,res);
});

router.get('/edit/:id',function(req,res){
  comment_controller.edit_comment(req,res);
});

router.post('/update',function(req,res){
  comment_controller.update_comment(req,res);
});



module.exports = router;