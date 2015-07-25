var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  username :{type: String},
  email : {type: String},
  password: {type: String},
  mutupo : {type: String},
  password_hash: {type: String},
  created_at: {type: Date}
  //account_confirmed: {type: Boolean}
});

//INSTANCE METHODS
/**
* Validate the password
* @param password - String: the password from the user
* @param callback - Function: the callback function to call when error occurs or
* after the end of the validation process. It's initially an argument provided to
* LocalStrategy callback.
*/
userSchema.methods.validatePassword = function (password, callback) {
  //TODO consider using custom error objects
  //save user object since the value of this will change
  var user = this;
  //generate salt
  bcrypt.compare(password, user.password_hash, function(err, same){
    if (err)
      callback(err);
    else if (same){
      callback(null, user);
    }
    else{
      callback(null, false, {message: 'Incorrect Password'});
    }
  });
}
user = mongoose.model('User',userSchema);
module.exports = user;



