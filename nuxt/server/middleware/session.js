const messup = require('messup');

const session = require('express-session');
const MemoryStore = require('memorystore')(session);


/**
 * Returns a session middleware provided by the express-session module.
 */
module.exports = function(){

  return session({
    name: 'sessid',
    secret: process.env.SESSION_KEY,
    saveUninitialized: false,
    resave: true,
    rolling: true,
    unset: 'destroy',
    genid(){
      return messup.bytes(32, 'base64');
    },
    store: new MemoryStore({
      checkPeriod: 1000 * 60 * 60 * 1,  // 1 hour
      ttl: 1000 * 60 * 60 * 0.5         // 0.5 hours
    }),
    cookie: {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    }
  });

}
