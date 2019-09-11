/**
 * Update the TTL of requested session
 */
module.exports = function(){

  return function(req, _, next){
    req.sessionStore.touch(req.sessionID, req.session);
    next();
  }

}
