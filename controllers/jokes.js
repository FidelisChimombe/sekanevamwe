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
      User.findOne({_id:joke.author},function(err,user){//might need some improvement
        if(!err){          
          if(level==="regular"){

             res.render('jokes/show',{message:"joke successfully created", joke :joke,title:"Regular Joke",user:req.user,comments:joke.comments});
          }else{            
            res.render('jokes/show',{message:"joke successfully created", joke : joke,title:"Eighteen Joke",user:req.user,comments:joke.comments});
          }
        }else{
          res.render('error',{error: "An error occured, while trying to make your joke"});
        }

        });
       
      }
    });  
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
  Joke.findOne({_id:joke_id},function(err,joke){  
    if(joke){
      User.findOne({_id:joke.author},function(err,user){        
        if(!err){
          Comment.find({joke_id:joke_id}).sort('-created_at').exec(function(err,comments){
            if(!err){
              Comment.populate(comments,{path:'author'},function(err,comments){
                if(!err){
                  res.render('jokes/show',{message:"Joke editing was successful",joke:joke,comments:comments,joke_author:user,title:"Joke",user:req.user});
                }else{
                  res.render('error',{error: "Can't show the jokes comments"});
                }
              });
            }else{
              res.render('error',{error: "Can't show the jokes comments"});
            }
          });

        }else{
          res.render('error',{error: "Can't show the jokes comments"});
        }
      });
           
    }else{
      res.render('error',{error: "Joke showing failed"});
    }

  });
}

//You can only edit what you posted

joke_controller.edit_joke = function(req,res){
  var joke_id = req.params.id;
  console.log("editting Joke");
  console.log(joke_id);
  console.log(req.user.id);
  Joke.findOne({_id:joke_id},function(err,joke){
    if(joke){  

      if(JSON.stringify(joke.author)===JSON.stringify(req.user.id)){ // serialization makes it easy to compare objects
        //will just return to you the original post before editing        
        res.render('jokes/edit',{message:"Joke editing was successful",joke:joke,title:"Edit Joke",id:req.user.id,user:req.user});
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
  var joke_id = req.params.id;
  var title = req.body.title;
  var level = req.body.level;
  var content = req.body.content; 
  Joke.findOne({_id:joke_id},function(err,joke){   
      if(joke){      
        if(JSON.stringify(joke.author)===JSON.stringify(req.user.id)){
          joke.content = content;
          joke.title=title;
          joke.level= level;
          joke.save(function(err,joke){
                 Comment.find({joke_id:joke.id},function(err,comments){
                  if(!err){
                    Comment.populate(comments,{path:'author'},function(err,comments){
                      if(!err){
                         res.render('jokes/show',{message:"Joke updating was successful",joke:joke,comments:comments,title:"Joke",user:req.user});
                      }else{
                        res.render('error',{error: "Can't show the jokes comments"});
                      }
                    });
                   
                  }else{
                    res.render('error',{error: "Can't show the jokes comments"});
                  }
                 });                          
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
            res.json({message:"Joke successfully flagged",joke:joke,user:req.user});//destroy the html element containg the flagged joke
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
      res.json({message:"These are all the comments",comments:comments,user:req.user});
    }else{
      res.json({error:"Can't return all the comments belonging to the joke"});
    }
  });
}

/*Anybody can like a joke, I am still trying to figure out a way of making unique likes

*/



joke_controller.like=function(req,res){
  var joke_id= req.params.joke_id;
  
  Joke.findOne({_id:joke_id},function(err,joke){
    
    if(joke){
      if(joke.likes.indexOf(req.user.id)===-1){ //check for the person liking no the joke id
        
        joke.likes.push(req.user.id);
        joke.save(function(err,joke){
          if(!err){
            
            console.log("Zvabhadhara");


            res.json({message:"successfully liked the joke",joke:joke,user:req.user});
          }else{
            res.render('error',{error:"couldn't like the joke"});
          }
        });
      }else{
        console.log("Zvabhadhara Pasina");
        res.render('error',{error:"You have already liked the joke"});
      }
    }else{
      res.render('error',{error:"Can't like the joke"});
    }
  });

}

//all jokes

joke_controller.all_jokes = function(req,res){
  Joke.find({}).sort('-created_at').exec(function(err,jokes){
    if(!err){      
       Joke.populate(jokes,{path: 'author'},function(err,jokes){
        if(!err){
          res.render('jokes/all_jokes',{message:"All Jokes",jokes:jokes,level:"regular",title:"Regular Jokes",user:req.user});
        }else{
          res.render('error',{error:"Can't retrieve jokes"});
        }
      });
    }else{
      res.render('error',{error:"Can't retrieve jokes"});
    }
  });
}

joke_controller.regular = function(req,res){
  Joke.find({level:"regular"}).sort('-created_at').exec(function(err,jokes){
    if(!err){

      Joke.populate(jokes,{path: 'author'},function(err,jokes){
        if(!err){          
          res.render('jokes/regular',{message:"All Jokes",jokes:jokes,level:"regular",title:"Regular Jokes",user:req.user});
        }else{
          res.render('error',{error:"Can't retrieve jokes"});
        }
      });
      }else{
       res.render('error',{error:"Can't retrieve jokes"});
    }    
  });
}

joke_controller.eighteen = function(req,res){
  Joke.find({level:"eighteen"}).sort('-created_at').exec(function(err,jokes){
    if(!err){
      Joke.populate(jokes,{path: 'author'},function(err,jokes){
        if(!err){
          res.render('jokes/eighteen',{message:"All Jokes",jokes:jokes,level:"regular",title:"Regular Jokes",user:req.user});
        }else{
          res.render('error',{error:"Can't retrieve jokes"});
        }
      });
    }else{
       res.render('error',{error:"Can't retrieve jokes"});
    }
    
  });
}
module.exports = joke_controller;

