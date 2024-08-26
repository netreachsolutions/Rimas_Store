// models/customerModel.js

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
  
  module.exports = {
    createCustomer,
    findCustomerByEmail,
    findCustomerById,
  };
  