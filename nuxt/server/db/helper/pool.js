const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });

pool.on('error', (err, client) => {
  console.error(err);
  console.log(client);
});


module.exports = pool;
