const { Pool } = require("pg");

// NOTE: prod, stage, test can be added
const isTest = process.env.NODE_ENV === "test";
const pool = new Pool({
  database: isTest ? process.env.PGDATABASE_TEST : process.env.PGDATABASE,
});

pool
  .query("SELECT current_database()")
  .then((result) => result.rows[0].current_database)
  .then((db) => console.log("Selected database", db));

module.exports = pool;
