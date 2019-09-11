const { forceArray } = require('./../../utils');
const pool = require('./pool');

/**
 * @see {@link https://node-postgres.com/features/queries#query-config-object}
 * @typedef {Object.<string, string|string[]} QueryConfig
 * @property {string} text
 * @property {*[]} values
 * @property {string=} name
 * @property {string=} rowMode
 * @property {Object.<string, *>} types
 * 
 * @see {@link https://node-postgres.com/api/result}
 * @typedef {Object.<string, *>} QueryResult
 * @property {*[]} rows
 * @property {*[]} fields
 * @property {number} rowCount
 * @property {string} command
 */

/**
 * Helper function to query the database using pg Pool.
 * @param {string|QueryConfig} query
 * @param {*} [values = []]
 * @returns {Promise<QueryResult>}
 * @throws {TypeError} Throws if query is not a string nor an object.
 */
module.exports = async function(query, values = []){
  switch(query && typeof query){
    case 'string':
      return await pool.query(query, forceArray(values));
    case 'object':
      query.values = forceArray(query.values);
      return await pool.query(query);
  }
  throw new TypeError('Query must be a string or an object.');
}
