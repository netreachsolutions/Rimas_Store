// services/authService.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { findCustomerByEmail, createCustomer, generateOTP, retrieveOTP } = require("../models/customerModel");
const { resolve } = require("path");
const { reject } = require("bcrypt/promises");

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

  static async generateOTP(db, customerId) {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
    const code_hash = await bcrypt.hash(code, 10);
    return new Promise((resolve, reject) => {
      generateOTP(db, customerId, code_hash, (err, result) => {
        if (err) return reject(err);
        resolve(code)
      }) 
    })
  }

  static async verifyOTP(db, customerId, otp) {
    return new Promise((resolve, reject) => {
      retrieveOTP(db, customerId, async (err, result) => {
        if (err) return reject(err);
        if (!result || result.length === 0) return reject(new Error('OTP not found'));

        const otp_object = result[0];
        const currentTime = new Date(new Date().toISOString());  // Ensure current time is in UTC
        const otpTimestamp = new Date(otp_object.updated_at);

        // Calculate the time difference in minutes
        const timeDifference = (currentTime - otpTimestamp) / (1000 * 60); // Difference in minutes
        
        console.log(otp_object)
        console.log(currentTime)
        console.log(otpTimestamp)
        console.log(timeDifference-60)
        // Check if the OTP is within the 2-minute window
        if ((timeDifference-60) > 2) {
          console.log('expired')
          return reject('expired');
        }

        const isOtpValid = await bcrypt.compare(otp, otp_object.code_hash); 
        if (!isOtpValid) {
          console.log('invalid')
          return reject('invalid');
        }

        const accessToken = jwt.sign({ customerId, role: 'customer_auth' }, process.env.JWT_SECRET, { expiresIn: '10min' });

        resolve({accessToken});
      }); 

    })
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
