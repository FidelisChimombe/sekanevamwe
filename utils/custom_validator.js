/**
* This validate the input from the user. It makes no assumptions that the clien
* validated the input.
*/

var validator = require('validator');

//TODO write proper messages
//TODO consider name validation 
/**
* Validates the user attributes as given by the user
* @param user - a user object
* @return - an array of error messages
*/
var validate_user = function(user){
  var error = [];
  //username: 0<size<=20, isAlpha, 
  if (validator.isNull(user.username)){
    error.push("username is required");
  }
  else if (!validator.isLength(user.username, 2, 50))
    error.push("Name can only be between 3 and 50 characters");
  //email: is email
  if (validator.isNull(user.email)){
    error.push("Email is required");
  }
  else if (!validator.isEmail(user.email))
    error.push("Email format is not recognized");
  //password
  if (validator.isNull(user.password)){
    error.push("Password is required");
  }
  else if (!validator.isLength(user.password, 6))
    error.push("Password should be at least 6 characters");
  
  return error;
};

module.exports = {
  validate: validate_user
};