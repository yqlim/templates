/* EXPOSE ENVIRONMENT VARIABLES */
require('dotenv').config();

const isLocal = process.env.LOCAL === 'true';



/* BASIC VARIABLES */
const consola = require('consola');

// SSL related modules are only available and used in local env.
const https = isLocal ? require('https') : null;
const ssl = isLocal ? require('./../ssl') : null;

const host = process.env.HOST;
const port = process.env.PORT;

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const middleware = require('./middleware');

const router = require('./router')



/* EXPRESS INIT */
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(middleware.responseUtils());
app.use(middleware.requestBodySanitizer());

app.use(cookieParser(process.env.COOKIE_KEY));
app.use(middleware.session());

app.use(router);



/* NUXT INIT */
const { Nuxt, Builder } = require('nuxt');
const config = require('../nuxt.config');   // Import and set Nuxt.js options
config.dev = !(process.env.NODE_ENV === 'production');

(async function start(){

  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  // Build only in dev mode
  if (config.dev){
    const builder = new Builder(nuxt);
    await builder.build();
  }

  // Give nuxt middleware to express
  app.use(nuxt.render);

  if (isLocal)
    https.createServer(ssl, app).listen(port, host);
  else
    app.listen(port, host);

  consola.ready({
    message: `Server listening on https://${host}:${port}`,
    badge: true
  })

})();
