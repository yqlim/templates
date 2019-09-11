module.exports = function(){

  return function(req, res, next){

    if (typeof res.success !== 'function'){
      res.success = function(message){
        return buildResponse(this, true, message);
      }.bind(res);
    }

    if (typeof res.fail !== 'function'){
      res.fail = function(message){
        if (message === null || message === void 0 || typeof message === 'string'){
          message = {
            errorMessage: message || 'An unexpected error occurred.'
          }
        }
        return buildResponse(this, false, message);
      }.bind(res);
    }

    next();

  };

}


function buildResponse(response, successStatus, message){
  if (response.headersSent)
    return;

  const static = { success: !!successStatus };

  switch (typeof message){
    case 'string':
      response.json({ ...static, message });
      break;
    case 'boolean':
      response.json(message);
      break;
    default:
      if (Object.prototype.toString.call(message) === '[object Object]')
        response.json({ ...static, ...message });
      else
        response.json({ ...static, message: 'Invalid response body.' });
  }
}
