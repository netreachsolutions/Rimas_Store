// models/customerModel.js

const { Queue } = require("twilio/lib/twiml/VoiceResponse");

// Queries for user-related operations
const createCustomer = (db, customerData, callback) => {
    const { email, first_name, last_name, password_hash } = customerData;
    const query = 'INSERT INTO customers (email, first_name, last_name, password_hash) VALUES (?, ?, ?, ?)';
    db.query(query, [email, first_name, last_name, password_hash], callback);
  };
  
const findCustomerByEmail = (db, email, callback) => {
    const query = 'SELECT * FROM customers WHERE email = ?';
    db.query(query, [email], callback);
};

const findCustomerById = (db, id, callback) => {
    const query = 'SELECT * FROM customers WHERE customer_id = ?';
    db.query(query, [id.toString()], callback);
};


const generateOTP = (db, id, code_hash, callback) => {
  const currentTime = new Date();
  console.log(currentTime)
  const query = `
    INSERT INTO otp (customer_id, code_hash, updated_at)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE code_hash = VALUES(code_hash)
  `;
  db.query(query, [id, code_hash, currentTime], callback);
};

const retrieveOTP = (db, id, callback) => {
  const query = `
    SELECT * FROM otp where customer_id = ?
  `;
  db.query(query, [id], callback);
};


  
  module.exports = {
    createCustomer,
    findCustomerByEmail,
    findCustomerById,
    generateOTP,
    retrieveOTP
  };
  