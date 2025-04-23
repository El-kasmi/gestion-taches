const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // ton mot de passe
  database: 'tasks_db'
});

module.exports = pool;
