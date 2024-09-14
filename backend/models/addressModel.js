// models/addressModel.js

const { queryDatabase } = require('../config/pool');


const createAddress = (db, addressData, callback) => {
    const { customerId, first_line, second_line, postcode, city, country } = addressData;
    const query = 'INSERT INTO addresses (customer_id, first_line, second_line, postcode, city, country) VALUES (?, ?, ?, ?, ?, ?)';
    // db.query(query, [customerId, first_line, second_line, postcode, city, country], callback);
    queryDatabase(query, [customerId, first_line, second_line, postcode, city, country], (err, results) => {
      if (err) return callback(err, null);  // Pass error to callback
      callback(null, results);              // Pass results to callback
    });
  };
  
  const findAddressByCustomerId = (db, customerId, callback) => {
    const query = 'SELECT * FROM addresses WHERE customer_id = ?';
    // db.query(query, [customerId], callback);
    queryDatabase(query, [customerId], (err, results) => {
      if (err) return callback(err, null);  // Pass error to callback
      callback(null, results);              // Pass results to callback
    });
  };

const setAllCustomerAddressFalse = (db, customerId, callback) => {
  const query = 'UPDATE addresses SET is_default = FALSE WHERE customer_id = ?';
  // db.query(query, [customerId], callback);
  queryDatabase(query, [customerId], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
}

const setDefaultAddress = (db, customerId, addressId, callback) => {
  const query = 'UPDATE addresses is_default = FALSE WHERE customer_id = ? AND address_id = ?';
  // db.query(query, [customerId, addressId], callback);
  queryDatabase(query, [customerId], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
}
  
  module.exports = {
    createAddress,
    findAddressByCustomerId,
    setAllCustomerAddressFalse,
    setDefaultAddress,
  };
  