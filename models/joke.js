var mongoose = require('mongoose');
var Comment = require('./../models/comment');


var Schema = mongoose.Schema;

var jokeSchema = new Schema({
  author:{type: Schema.Types.ObjectId, ref: 'User', required: true},
  likes :[{type: Schema.Types.ObjectId, ref: 'User'}], //array of people who liked the joke
  title : {type: String},
  content: {type: String},
  level : {type: String}, //18+ or regular
  flags: {type: Number}, //if flags are greater than 5, move the joke 18+ 
  created_at: {type: Date}
});

/*
@param id - is the joke_id
@return an object containing all comments belonging to a particular joke
*/
jokeSchema.methods.comments = function(id){
  Comment.find({joke_id:id},function(err,comments){
    if(!err){
      return {comments:comments};
    }else{
      return {error:"Can't return all the comments belonging to the joke"};
    }
  });
}

/*
@param level - is the level of the joke, whether its regular, 18+ or something else
@return - an object containing the jokes of a particular level

*/
jokeSchema.methods.jokes=function(level){
  Joke.find({level:level},function(err,jokes){
    if(!err){
      return {jokes:jokes};
    }else{
      return {error:"Can't retrieve those type of jokes"};
    }
  });
}


joke = mongoose.model('Joke',jokeSchema);
module.exports = joke;