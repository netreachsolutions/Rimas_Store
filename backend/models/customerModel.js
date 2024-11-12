// models/customerModel.js

const { queryDatabase } = require('../config/pool');

// const { Queue } = require("twilio/lib/twiml/VoiceResponse");

// Queries for user-related operations
const createCustomer = (customerData, callback) => {
    const { phone, email, name, password_hash } = customerData;
    const query = 'INSERT INTO customers (email, name, phone_number, password_hash) VALUES (?, ?, ?, ?)';
    // db.query(query, [email, first_name, last_name, password_hash], callback);
    queryDatabase(query, [email, name, phone, password_hash], (err, results) => {
      if (err) return callback(err, null);  // Pass error to callback
      callback(null, results);              // Pass results to callback
    });
  };

  const createBasicCustomer = (customerData, callback) => {
    const { name, contact  } = customerData;
    if (contact.includes('@')) {
      const query = 'INSERT INTO customers (email, name) VALUES (?, ?)';

      queryDatabase(query, [contact, name], (err, results) => {
        if (err) return callback(err, null);  // Pass error to callback
      callback(null, results);              // Pass results to callback
    });
    } else {
      const query = 'INSERT INTO customers (phone_number, name) VALUES (?, ?)';

      queryDatabase(query, [contact, name], (err, results) => {
        if (err) return callback(err, null);  // Pass error to callback
        callback(null, results);              // Pass results to callback
      });
  
    }

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
  
  
const findCustomerByEmail = (email, callback) => {
    const query = 'SELECT * FROM customers WHERE email = ?';
    // db.query(query, [email], callback);
    queryDatabase(query, [email], (err, results) => {
      if (err) return callback(err, null);  // Pass error to callback
      callback(null, results);              // Pass results to callback
    });
};

const findCustomerByPhone = (phone, callback) => {
  const query = 'SELECT * FROM customers WHERE phone_number = ?';
  // db.query(query, [email], callback);
  queryDatabase(query, [phone], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
};

const findCustomerById = (id, callback) => {
    const query = 'SELECT * FROM customers WHERE customer_id = ?';
    // db.query(query, [id.toString()], callback);
    queryDatabase(query, [id.toString()], (err, results) => {
      if (err) return callback(err, null);  // Pass error to callback
      callback(null, results);              // Pass results to callback
    });
};


// const generateOTP = (id, code_hash, callback) => {
//   const currentTime = new Date();
//   console.log(currentTime)
//   const query = `
//     INSERT INTO otp (customer_id, code_hash, updated_at)
//     VALUES (?, ?, ?)
//     ON DUPLICATE KEY UPDATE code_hash = VALUES(code_hash), updated_at = VALUES(updated_at)
//   `;
//   // db.query(query, [id, code_hash, currentTime], callback);
//   queryDatabase(query, [id, code_hash, currentTime], (err, results) => {
//     if (err) return callback(err, null);  // Pass error to callback
//     callback(null, results);              // Pass results to callback
//   });
// };

const generateOTP = (contact, code_hash, callback) => {
  const currentTime = new Date();
  console.log(currentTime)
  if (contact.includes('@')) {
    const query = `
    INSERT INTO otp (email, code_hash, updated_at)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE code_hash = VALUES(code_hash), updated_at = VALUES(updated_at)
  `;
  queryDatabase(query, [contact, code_hash, currentTime], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
  } else {
    const query = `
      INSERT INTO otp (phone_number, code_hash, updated_at)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE code_hash = VALUES(code_hash), updated_at = VALUES(updated_at)
    `;
    queryDatabase(query, [contact, code_hash, currentTime], (err, results) => {
      if (err) return callback(err, null);  // Pass error to callback
      callback(null, results);              // Pass results to callback
    });

  }
  // db.query(query, [id, code_hash, currentTime], callback);
};

const retrieveOTP = (contact, callback) => {
  // check if contact info is email on phone number
  if (contact.includes('@')) {
    const query = `
    SELECT * FROM otp where email = ?
  `;
  queryDatabase(query, [contact], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
  } else {
    const query = `
    SELECT * FROM otp where phone_number = ?
  `;
    queryDatabase(query, [contact], (err, results) => {
      if (err) return callback(err, null);  // Pass error to callback
      callback(null, results);              // Pass results to callback
    });

  }
};

const retrieveOTPByNumber = (phone, callback) => {
  const query = `
    SELECT * FROM otp where phone_number = ?
  `;
  // db.query(query, [id], callback);
  queryDatabase(query, [phone], (err, results) => {
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
    createBasicCustomer,
    findCustomerByEmail,
    findCustomerByPhone,
    findCustomerById,
    generateOTP,
    retrieveOTP,
    retrieveOTPByNumber,
    resetPassword,
    updateField
  };
  