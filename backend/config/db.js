const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Establecer el esquema por defecto
pool.on("connect", (client) => {
  client.query(`SET search_path TO ${process.env.DB_SCHEMA}, public`);
});

module.exports = pool;