const consola = require('consola');

/**
 * Request body sanitizer functions.
 * @typedef   {Object}    Sanitizer
 *            Object containing sanitizer functinos.
 * @property  {Function}  object
 *            Function to deep sanitize object values.
 * @property  {Function}  string
 *            Function to sanitize string.
 * @property  {Function}  array
 *            Function to deep sanitize array values.
 * @property  {Function}  default
 *            Function to sanitize non-object and non-array item.
 */


/**
 *  @constant {Sanitizer}
 */
const sanitize = {};


/**
 * Function to deep sanitize object values.
 * @param   {Object.<string, *>}  obj
 *          The object to sanitize.
 * @returns {Object.<string, *>}
 *          A new object containing sanitized key-value pairs.
 */
sanitize.object = function(obj){
  for (const key in obj){
    if (!obj.hasOwnProperty(key))
      continue;

    const val = obj[key];

    if (Array.isArray(val))
      obj[key] = this.array(val);//obj[key].forEach(this.array, this);

    else if (val && typeof val === 'object')
      obj[key] = this.object(val);

    else
      obj[key] = this.default(val);
  }

  return obj;
}


/**
 * Function to deep sanitize array values.
 * @param   {Array.<*>} array
 *          The array to be sanitized.
 * @returns {Array.<*>}
 *          A new array containing sanitized values.
 */
sanitize.array = function(array){
  return array.map(val => {
    if (Array.isArray(val))
      return this.array(val);

    if (val && typeof val === 'object')
      return this.object(val);

    return this.default(val);
  });
}


/**
 * Function to sanitize non-object and non-array item except boolean.
 * @param   {*} val
 *          The value to sanitize.
 * @returns {*}
 *          Either a string (if the item is not boolean and can be converted to string) or the original type.
 */
sanitize.default = function(val){
  if (val === null || typeof val === 'boolean')
    return val;

  if (typeof val !== 'string')
      val = String(val);

  return sanitize.string(val);
}


/**
 * Function to sanitize string.
 * @param   {string}  str
 *          The string to be sanitized.
 * @returns {string}
 */
sanitize.string = function(str){
  return str.replace(/[\\$'"]/g, '\\$&');
}


/**
 * Returns an Express middleware to sanitize all items in request body.
 * The middleware requires the body-parser module to work.
 */
module.exports = function(){

  return function(req, res, next){

    if (req.body)
      req.body = sanitize.object(req.body);
    else {
      consola.warn('Request.body is not defined.');
      res.status(400);
    }

    next();

  }

}
