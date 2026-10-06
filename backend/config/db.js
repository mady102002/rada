const { Pool } = require("pg");

require("dotenv").config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    ssl: false,

    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
});

pool.on("connect", (client) => {
    const schema = process.env.DB_SCHEMA || "public";

    client.query(`SET search_path TO ${schema}, public`)
        .then(() => {
            console.log(`✅ PostgreSQL conectado - schema: ${schema}`);
        })
        .catch((error) => {
            console.error("❌ Error configurando schema:", error);
        });
});

pool.on("error", (error) => {
    console.error("❌ Error inesperado de PostgreSQL:", error);
});

module.exports = pool;