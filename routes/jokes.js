var express = require('express');
var passport = require('passport');
var router = express.Router();
var joke_controller=require('./../controllers/jokes');
var response = require('./../utils/response.js');
var User = require('./../models/user');
require('./../utils/auth.js');



//TODOS
//edit joke
//show joke



router.post('/new_joke',function(req,res){

  console.log(req.headers.cookie);
  joke_controller.new_joke(req,res);
});

router.post('/delete_joke',function(req,res){
  joke_controller.delete_joke(req,res);
});

router.get('/edit/:id',function(req,res){
  joke_controller.edit_joke(req,res);
});

router.post('/update',function(req,res){
  joke_controller.update_joke(req,res);
});

router.post('/flag',function(req,res){
  joke_controller.flag_joke(req,res);
});

router.get('/all_comments/:joke_id',function(req,res){
  joke_controller.all_comments(req,res);
});

router.post('/like',function(req,res){//gotta work on liking a little bit more
  joke_controller.like(req,res);
});

router.get('/all_jokes',function(req,res){
  joke_controller.all_jokes(req,res);
});

router.get('/regular',function(req,res){
  joke_controller.regular(req,res);
});

router.get('/regular',function(req,res){
  joke_controller.regular(req,res);
});

router.get('/new_joke',function(req,res){
  res.render('jokes/new_joke',{title:"New Joke",message:"Fidelis",id:req.user.id});
});

router.get('/eighteen',function(req,res){
  joke_controller.eighteen(req,res);
});



module.exports = router;