var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  author:{type: Schema.Types.ObjectId, ref: 'User', required: true}, 
  joke_id : {type: Schema.Types.ObjectId,ref:'Joke'}, //like a foreign_id pointing to the original joke, will populate comments using joke id
  content: {type: String},
  created_at: {type: Date}
});



comment = mongoose.model('Comment',commentSchema);
module.exports = comment;
