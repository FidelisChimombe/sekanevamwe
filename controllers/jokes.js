var express = require('express');
var mongoose = require('mongoose');
var response = require('./../utils/response.js');
var User = require('./../models/user');
var Joke = require('./../models/joke');
var Comment = require('./../models/comment');
var joke_controller= {};


joke_controller.new_joke=function(req,res){
  var author_id = req.body.id;//put req.user though
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
        res.render('error',{error: "An error occured, while trying to make your joke"});
      }else{
        if(level==="regular"){
          res.render('jokes/regular',{message:"joke successfully created", joke : joke,title:"Regular Jokes"});
        }else{
          res.render('jokes/eighteen',{message:"joke successfully created", joke : joke,title:"Eighteen Jokes"});
        }
      }
    });
  }else{
    res.render('error',{error:"Can't post the joke because you are not logged in"})
  }
}


joke_controller.delete_joke = function(req,res){
  var joke_id = req.body.id;
  var author_id = req.body.author_id;
  console.log(req.user.id === author_id);
  if(req.user.id === author_id){
    Joke.findByIdAndRemove({_id:joke_id},function(err){
      if(!err){
        res.json({message:"Joke successfully deleted"})
      }else{
        res.json({error:"Joke couldn't be deleted"});
      }
    });
  }else{
    res.json({error:"You can't delete the joke because you are not the author "});
  }
}

joke_controller.show_joke = function(req,res){
  var joke_id = req.params.joke_id;
  Joke.findOne(joke_id,function(err,joke){
    if(joke){
        var comments=Joke.comments(joke_id);
        if(comments.comments != undefined){      
          res.render('jokes/show',{message:"Joke editing was successful",joke:joke,comments:comments.comments,title:"Joke"});
        }else{
          res.render('error',{error: "Can't show the jokes comments"});
        }     
    }else{
      res.render('error',{error: "Joke showing failed"});
    }

  });
}

//You can only edit what you posted

joke_controller.edit_joke = function(req,res){
  var joke_id = req.params.joke_id;
  console.log(req.user.id);
  Joke.findOne(joke_id,function(err,joke){
    if(joke){  
      if(JSON.stringify(joke.author)===JSON.stringify(req.user.id)){ // serialization makes it easy to compare objects
        //will just return to you the original post before editing
        res.render('jokes/edit',{message:"Joke editing was successful",joke:joke,title:"Edit Joke"});
      }else{
        res.render('error',{error: "you can't edit because you are not the owner of the post"});
      }
    }else{
      res.render('error',{error: "Joke editing failed"});
    }

  });

}

//You can only edit what you posted

joke_controller.update_joke = function(req,res){
  var joke_id = req.body.joke_id;
  var content = req.body.content;
  console.log(content);
  Joke.findOne(joke_id,function(err,joke){
      if(joke){
        if(JSON.stringify(joke.author)===JSON.stringify(req.user.id)){
          joke.content = content;
          joke.save(function(err,joke){
                 var comments=Joke.comments(joke_id);
                 if(comments.comments != undefined){      
                   res.render('jokes/show',{message:"Joke updating was successful",joke:joke,comments:comments.comments,title:"Joke"});
                 }else{
                   res.render('error',{error: "Can't show the jokes comments"});
                 }          
          });
        }else{
            res.render('error',{error: "you can't edit because you are not the owner of the post"});
        }
      }else{
        res.render({error: "Joke updating failed"});
      }
    }); 
 }

  

//flag_a_joke, transfers a joke from regular to 18+

joke_controller.flag_joke = function(req,res){
  var joke_id = req.body.id;
  Joke.findOne(joke_id,function(err,joke){
      if(!err){
        joke.flags++; //when flag is above 5, change the joke from regular to 18+
        joke.save(function(err,joke){
          if(joke){
            res.json({message:"Joke successfully flagged",joke:joke});//destroy the html element containg the flagged joke
          }else{
            res.json({error:"Can't save the object"});
          }
        });
      }else{
        res.render('error',{error:"Error occured"});
     }
  });
}
//get_all_comments_of_a_joke_using_joke_id

joke_controller.all_comments=function(req,res){
  var joke_id = req.params.joke_id;
  console.log(req);
  Comment.find({joke_id:joke_id},function(err,comments){
    if(!err){
      res.json({message:"These are all the comments",comments:comments});
    }else{
      res.json({error:"Can't return all the comments belonging to the joke"});
    }
  });
}

/*Anybody can like a joke, I am still trying to figure out a way of making unique likes

*/

joke_controller.like=function(req,res){
  var joke_id= req.body.joke_id;
  Joke.findOne(joke_id,function(err,joke){
    if(joke){
      if(joke.likes.indexOf(joke_id)===-1){ //check for the person liking no the joke id
        joke.likes.push(joke_id);
        joke.save(function(err,joke){
          if(!err){
            res.json({message:"successfully liked the joke",joke:joke});
          }else{
            res.json({error:"couldn't like the joke"});
          }
        });
      }else{
        res.json({error:"You have already liked the joke"});
      }
    }else{
      res.json({error:"Can't like the joke"});
    }
  });

}

//all jokes

joke_controller.all_jokes = function(req,res){
  Joke.find({},function(err,jokes){
    if(!err){
      res.render('jokes/all_jokes',{message:"All Jokes",jokes:jokes,level:"all_jokes",title:"All Jokes"});
    }else{
      res.render('error',{error:"Can't retrieve jokes"});
    }
  });
}

joke_controller.regular = function(req,res){
  Joke.find({level:"regular"},function(err,jokes){
    if(!err){
      res.render('jokes/regular',{message:"All Jokes",jokes:jokes,level:"regular",title:"Regular Jokes"});
    }else{
       res.render('error',{error:"Can't retrieve jokes"});
    }
    
  });
}

joke_controller.eighteen = function(req,res){
  Joke.find({level:"regular"},function(err,jokes){
    if(!err){
      res.render('jokes/eighteen',{message:"All Jokes",jokes:jokes, level:"eighteen",title:"18+ Jokes"});
    }else{
       res.render('error',{error:"Can't retrieve jokes"});
    }
    
  });
}



module.exports = joke_controller;

