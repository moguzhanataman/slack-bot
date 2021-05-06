const { Client, Pool } = require("pg");
const pool = new Pool();

module.exports = pool;

// client.query("select 1").then((value) => {
//   console.log("query result", value);
// });
