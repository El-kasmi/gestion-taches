const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // mot de passe vide
  database: 'tasks_db'
});

module.exports = pool;
