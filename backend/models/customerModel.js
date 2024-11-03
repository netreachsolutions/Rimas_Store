// models/customerModel.js

const { queryDatabase } = require('../config/pool');

// const { Queue } = require("twilio/lib/twiml/VoiceResponse");

// Queries for user-related operations
const createCustomer = (db, customerData, callback) => {
    const { email, first_name, last_name, password_hash } = customerData;
    const query = 'INSERT INTO customers (email, first_name, last_name, password_hash) VALUES (?, ?, ?, ?)';
    // db.query(query, [email, first_name, last_name, password_hash], callback);
    queryDatabase(query, [email, first_name, last_name, password_hash], (err, results) => {
      if (err) return callback(err, null);  // Pass error to callback
      callback(null, results);              // Pass results to callback
    });
  };

  const resetPassword = (customerId, password_hash, callback) => {
    const query = `
      UPDATE customers 
      SET password_hash = ? 
      WHERE customer_id = ?
    `;
    queryDatabase(query, [password_hash, customerId], (err, results) => {
      if (err) return callback(err, null);  // Pass error to callback
      callback(null, results);              // Pass results to callback
    });
  };
  
  
const findCustomerByEmail = (db, email, callback) => {
    const query = 'SELECT * FROM customers WHERE email = ?';
    // db.query(query, [email], callback);
    queryDatabase(query, [email], (err, results) => {
      if (err) return callback(err, null);  // Pass error to callback
      callback(null, results);              // Pass results to callback
    });
};

const findCustomerById = (db, id, callback) => {
    const query = 'SELECT * FROM customers WHERE customer_id = ?';
    // db.query(query, [id.toString()], callback);
    queryDatabase(query, [id.toString()], (err, results) => {
      if (err) return callback(err, null);  // Pass error to callback
      callback(null, results);              // Pass results to callback
    });
};


const generateOTP = (db, id, code_hash, callback) => {
  const currentTime = new Date();
  console.log(currentTime)
  const query = `
    INSERT INTO otp (customer_id, code_hash, updated_at)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE code_hash = VALUES(code_hash), updated_at = VALUES(updated_at)
  `;
  // db.query(query, [id, code_hash, currentTime], callback);
  queryDatabase(query, [id, code_hash, currentTime], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
};

const retrieveOTP = (db, id, callback) => {
  const query = `
    SELECT * FROM otp where customer_id = ?
  `;
  // db.query(query, [id], callback);
  queryDatabase(query, [id], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
};

const updateField = (customerId, fieldName, value, callback) => {
  const query = `
    UPDATE customers 
    SET ${fieldName} = ?
    WHERE customer_id = ?
  `;
  queryDatabase(query, [value, customerId], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
};


  
  module.exports = {
    createCustomer,
    findCustomerByEmail,
    findCustomerById,
    generateOTP,
    retrieveOTP,
    resetPassword,
    updateField
  };
  