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
  comments:[{type: Schema.Types.ObjectId, ref: 'Comment'}],
  created_at: {type: Date}
});




joke = mongoose.model('Joke',jokeSchema);
module.exports = joke;