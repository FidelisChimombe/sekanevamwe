var express = require('express');
var mongoose = require('mongoose');
var response = require('./../utils/response.js');
var User = require('./../models/user');
var Joke = require('./../models/joke');
var Comment = require('./../models/comment');
var joke_controller= {};


joke_controller.new_joke=function(req,res){
  var author_id = req.user.id;
  var content = req.body.content;
  var level = req.body.level;
  var created_at = Date.now();
  var title = req.body.title;

  var new_joke = new Joke({
    author: author_id,
    content: content,
    title:title,
    level:level,
    created_at: created_at,
    likes:[],
    flags:0
  });

  if(req.user.id === author_id){
    new_joke.save(function(err,joke){
      if(err){
        res.json({error: "An error occured, while trying to make your joke"});
      }else{
        res.json({message:"joke successfully created", joke : joke})
      }
    });
  }else{
    res.json({message:"Can't post the joke because you are not logged in"})
  }
}


joke_controller.delete_joke = function(req,res){
  var joke_id = req.params.id;
  var author_id = req.params.author_id;
  if(req.user.id === author_id){
    Joke.findByIdAndRemove({id:joke_id},function(err){
      if(!err){
        res.json({message:"Joke successfully deleted"})
      }else{
        res.json({message:"Joke couldn't be deleted"});
      }
    });
  }else{
    res.json({message:"You can't delete the joke because you are not the author ");
  }
}

//You can only edit what you posted

joke_controller.edit_joke = function(req,res){
  var joke_id = req.params.joke_id;
  Joke.findOne(joke_id,function(err,joke){
    if(joke){
      if(joke.author === req.user.id){
        //will just return to you the original post before editing
        res.json({joke:joke});
      }else{
        res.json({message: "you can't edit because you are not the owner of the post"});
      }
    }else{
      res.json({message: "Joke editing failed"});
    }

  });

}

//You can only edit what you posted

joke_controller.update_joke = function(req,res){
  var joke_id = req.params.joke_id;
  var content = req.params.content;
  Joke.findOne(joke_id,function(err,joke){
    if(joke){
      if(joke.author === req.user.id){
        joke.content = content;
        joke.save(err,joke){
          if(!err){
            res.json({message:"Joke successfully updated", joke:joke});
          }else{
            res.json({message:"Joke updating failed"});
          }
        }
      }else{
        res.json({message: "you can't edit because you are not the owner of the post"});
      }
    }else{
      res.json({message: "Joke editing failed"});
    }

  });

} 
//flag_a_joke, transfers a joke from regular to 18+

joke_controller.flag_joke = function(req,res){
  var joke_id = req.params.id;
  Joke.findOne(joke_id,function(err,joke){
    if(!err){
      joke.flags++;
      joke.save(err,joke){
        res.json({message:"Joke successfully flagged",joke:joke});//destroy the html element containg the flagged joke
      }else{
        res.json({message:"Couldn't flag the joke"});
      }
    }else{

    }
  });

}
//get_all_comments_of_a_joke_using_joke_id

joke_controller.all_comments=function(req,res){
  var joke_id = req.params.joke_id;
  Comment.find({joke_id:joke_id}),function(err,comments){
    if(!err){
      res.json({message:"These are all the comments",comments:comments});
    }else{
      res.json({message:"Can't return all the comments belonging to the joke"});
    }
  });
  //use mongoose to populate
}

//anybody can like a joke

joke_controller.like=function(req,res){
  var joke_id= req.params.joke_id;
  Joke.findOne(joke_id,function(err,joke){
    if(joke){
      if(joke.likes.indexOf(joke_id)===-1){ //check for the person liking no the joke id
        joke.likes.push(joke_id);
        joke.save(err,joke){
          if(!err){
            res.json({message:"successfully liked the joke",joke:joke});
          }else{
            res.json({message:"couldn't like the joke"});
          }
        }
      }else{
        res.json({message:"You have already liked the joke"});
      }
    }
  });

}

//all jokes

joke_controller.all_jokes = function(req,res){
  Joke.find({},function(err,jokes){
    if(!err){
      res.json({message:"All Jokes",jokes:jokes});
    }else{
      res.json({message:"Can't retrieve jokes"});
    }
  });
}
module.exports = joke_controller;

