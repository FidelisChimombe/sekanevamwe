var express = require('express');
var passport = require('passport');
var router = express.Router();
var joke_controller=require('./../controllers/jokes');
var response = require('./../utils/response.js');
var User = require('./../models/user');
require('./../utils/auth.js');


router.post('/new_joke',function(req,res){
  joke_controller.new_joke(req,res);
});

router.delete('/delete_joke/:id',function(req,res){
  joke_controller.delete_joke(req,res);
});

router.get('/edit/:id',function(req,res){
  joke_controller.edit_joke(req,res);
});

router.put('/update/:id',function(req,res){
  joke_controller.update_joke(req,res);
});

router.post('/flag/:id',function(req,res){
  joke_controller.flag_joke(req,res);
});

router.get('/all_comments/:joke_id',function(req,res){
  joke_controller.all_comments(req,res);
});

router.post('/like/:id',function(req,res){
  joke_controller.like(req,res);
});

router.get('/jokes',function(req,res){
  joke_controller.all_jokes(req,res);
});

module.exports = router;