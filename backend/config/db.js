// config/db.js
const mysql = require('mysql2');

// Configure MySQL
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL database:', err);
//     process.exit(1); // Exit process with failure
//   }
//   console.log('Connected to MySQL database');
// });

module.exports = db;
