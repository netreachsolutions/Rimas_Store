// models/addressModel.js

const createAddress = (db, addressData, callback) => {
    const { customerId, first_line, second_line, postcode, city, country } = addressData;
    const query = 'INSERT INTO addresses (customer_id, first_line, second_line, postcode, city, country) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [customerId, first_line, second_line, postcode, city, country], callback);
  };
  
  const findAddressByCustomerId = (db, customerId, callback) => {
    const query = 'SELECT * FROM addresses WHERE customer_id = ?';
    db.query(query, [customerId], callback);
  };

const setAllCustomerAddressFalse = (db, customerId, callback) => {
  const query = 'UPDATE addresses SET is_default = FALSE WHERE customer_id = ?';
  db.query(query, [customerId], callback);
}

const setDefaultAddress = (db, customerId, addressId, callback) => {
  const query = 'UPDATE addresses is_default = FALSE WHERE customer_id = ? AND address_id = ?';
  db.query(query, [customerId, addressId], callback);
}
  
  module.exports = {
    createAddress,
    findAddressByCustomerId,
    setAllCustomerAddressFalse,
    setDefaultAddress,
  };
  