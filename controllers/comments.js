var express = require('express');
var mongoose = require('mongoose');
var response = require('./../utils/response.js');
var User = require('./../models/user');
var Joke = require('./../models/joke');
var Comment = require('./../models/comment');
var comment_controller= {};



//can only comment if you are logged in
comment_controller.new_comment=function(req,res){
  var author_id = req.user.id;
  var joke_id = req.body.joke_id;
  var content = req.body.content;
  var created_at = Date.now();
  

  var new_comment = new Joke({
    author: author_id,
    content: content,
    joke_id : joke_id,
    created_at: created_at,
    });

  if(JSON.stringify(req.user.id) === JSON.stringify(author_id)){
    new_comment.save(function(err,comment){
      if(err){
        res.json({error: "An error occured, while trying to make your comment"});
      }else{ 
        //on success add the comment id in the Joke comments
        Joke.findOne(joke_id,function(err,joke){
          if(!err){
            joke.comments.push(comment.id);
            res.json({message:"comment successfully created", comment : comment, joke_comments:joke.comments,user:req.user});
          }else{
            res.json({message:"Can't post the comment because you are not logged in"});
          }
        });
       
      }
    });
  }else{
    res.json({message:"Can't post the comment because you are not logged in"});
  }
}

//can't comment on jokes now, but later
comment_controller.delete_comment = function(req,res){
  var comment_id = req.body.comment_id;
  var author_id = req.body.author_id;
  if(JSON.stringify(req.user.id) ===JSON.stringify(author_id)){
    Comment.findByIdAndRemove({id:comment_id},function(err){
      if(!err){
        res.json({message:"Comment successfully deleted",user:req.user});
      }else{
        res.json({message:"Comment couldn't be deleted"});
      }
    });
  }else{
    res.json({message:"You can't delete the comment because you are not the author "});
  }
}

//You can only edit what you posted
//can't comment on jokes now

comment_controller.edit_comment = function(req,res){
  var comment_id = req.params.comment_id;
  Comment.findOne(comment_id,function(err,comment){
    if(comment){
      if(JSON.stringify(req.user.id) ===JSON.stringify(author_id)){
        //will just return to you the original post before editing
        res.json({comment:comment,user:req.user});
      }else{
        res.json({message: "you can't edit because you are not the owner of the comment"});
      }
    }else{
      res.json({message: "Comment editing failed"});
    }

  });

}

//You can only edit what you posted
//can't update a joke yet

comment_controller.update_comment = function(req,res){
  var comment_id = req.params.comment_id;
  var content = req.params.content;
  Comment.findOne(joke_id,function(err,comment){
    if(comment){
      if(JSON.stringify(req.user.id) ===JSON.stringify(author_id)){
        comment.content = content;
        comment.save(function(err,comment){
          if(!err){
            res.json({message:"Comment successfully updated", comment:comment,user:req.user});
          }else{
            res.json({message:"Comment updating failed"});
          }
        });
      }else{
        res.json({message: "you can't edit because you are not the owner of the comment"});
      }
    }else{
      res.json({message: "Comment editing failed"});
    }

  });

}

module.exports = comment_controller;
