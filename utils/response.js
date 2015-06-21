/**
* This is the interface for receiving responses from various controllers and 
* sending them to the client
*/

/**
* Sends a response when a request was successful
* @param res - the express response object
* @param message - String/Array: the message to the client.
* @param data - json: the data send to the client
* @param http_code: an HTTP code of form 2XX to signify success
*/
var success = function(res, message, data, http_code){
  res.status(http_code).json({
    success: true,
    message: message,
    data: data
  });
}

/**
* Sends a response when a request was unsuccessful
* @param res - the express response object
* @param message - String/Array: the message to the client.
* @param data - json: the HTTP code corresponding to the error
*/
var failure = function(res, message, http_code){
  res.status(http_code).json({
    success: false,
    message: message
  })
}

module.exports = {
  success: success,
  failure: failure
}