// services/authService.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { findCustomerByEmail, createCustomer } = require("../models/customerModel");

class AuthService {
  static async registerCustomer(db, userData) {
    const { email, first_name, last_name, password } = userData;
    const passwordHash = await bcrypt.hash(password, 10);

    return new Promise((resolve, reject) => {
      createCustomer(db, { email, first_name, last_name, password_hash: passwordHash }, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  static async loginCustomer(db, email, password) {
    return new Promise((resolve, reject) => {
      findCustomerByEmail(db, email, async (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) return reject(new Error('Invalid email or password'));

        const customer = results[0];
        const isValidPassword = await bcrypt.compare(password, customer.password_hash);

        if (!isValidPassword) {
          return reject(new Error('Invalid email or password'));
        }

        const accessToken = jwt.sign({ customerId: customer.customer_id, role: 'customer' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        resolve({ accessToken });
      });
    });
  }

  static async loginAdmin(username, password, timestamp) {
    return new Promise( async (resolve, reject) => {

        console.log(password)
        const isValidPassword = await bcrypt.compare(password, process.env.ADMIN_PASS);
        console.log(isValidPassword)
        if (!isValidPassword || username!='admin') {
          console.log('Invalid email or password')
          return reject(new Error('Invalid email or password'));
        }

        const accessToken = jwt.sign({ customerId: -1, role: 'admin', timestamp }, process.env.JWT_SECRET, { expiresIn: '1h' });
        resolve({ accessToken });
      
    });
  }

  static validateAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return null;
    }
  }
}

module.exports = AuthService;
