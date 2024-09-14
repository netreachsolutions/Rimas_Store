const mysql = require('mysql2');

// Configure MySQL connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,    // Set a higher limit based on expected concurrent requests
  queueLimit: 0,          // No limit for queueing connections, handle as many as needed
//   acquireTimeout: 10000,  
  multipleStatements: true // Enable if you plan to run multiple SQL statements in one query
});

pool.query('SELECT 1', (err) => {
    if (err) {
      console.error('Error with MySQL Database Connection', err);
    } else {
      console.log('Connected to MySQL database');
    }
  });

// Keep the pool alive by periodically pinging the database
setInterval(() => {
  pool.query('SELECT 1', (err) => {
    if (err) {
      console.error('Error with MySQL keep-alive ping:', err);
    } else {
      console.log('MySQL keep-alive ping successful');
    }
  });
}, 600000); // Ping every 60 seconds to keep connections active

// // Function to query the database
// const queryDatabase = (sql, values) => {
//   return new Promise((resolve, reject) => {
//     pool.query(sql, values, (error, results) => {
//       if (error) return reject(error);
//       resolve(results);
//     });
//   });
// };

// Function to query the database using a callback
const queryDatabase = (sql, values, callback) => {
    pool.query(sql, values, (error, results) => {
      if (error) return callback(error, null);  // Pass error and null result to callback
      callback(null, results);                  // Pass null error and results to callback
    });
  };
  

// Export the query function and pool
module.exports = {
  queryDatabase,
  pool
};
