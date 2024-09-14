// models/paymentModel.js

const { queryDatabase } = require('../config/pool');


const createPayment = (db, paymentData, callback) => {
    const { order_id, processor_id, amount, currency } = paymentData;
    const query = 'INSERT INTO payments (order_id, processor_id, amount, currency) VALUES (?, ?, ?, ?)';
    // db.query(query, [order_id, processor_id, amount, currency], callback);
    queryDatabase(query, [order_id, processor_id, amount, currency], (err, results) => {
      if (err) return callback(err, null);  // Pass error to callback
      callback(null, results);              // Pass results to callback
    });
  };
  
  module.exports = {
    createPayment,
  };
  