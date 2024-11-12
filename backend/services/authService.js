// services/authService.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { findCustomerByEmail, createCustomer, generateOTP, retrieveOTP, resetPassword, findCustomerByPhone, retrieveOTPByNumber, createBasicCustomer } = require("../models/customerModel");
const { resolve } = require("path");
const { reject } = require("bcrypt/promises");
const { type } = require("os");

class AuthService {
  static async registerCustomer(userData) {
    const { email, name, phone, password } = userData;
    const passwordHash = await bcrypt.hash(password, 10);

    return new Promise((resolve, reject) => {
      createCustomer({ email, name, phone, password_hash: passwordHash }, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  static async registerCustomer2(name, contact) {
    return new Promise((resolve, reject) => {
      createBasicCustomer({ name, contact }, (err, result) => {
        if (err) return reject(err);
        console.log(result.insertId)
        if (result) {
          const accessToken = jwt.sign({ customerId: result.insertId, role: 'customer' }, process.env.JWT_SECRET, { expiresIn: '30min' });
          resolve(accessToken);
        } else {
          return reject('error creating customer')
        }

      });
    });
  }

  static async generateOTP(contact) {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
    const code_hash = await bcrypt.hash(code, 10);
    return new Promise((resolve, reject) => {
      generateOTP(contact, code_hash, (err, result) => {
        if (err) return reject(err);
        resolve(code)
      }) 
    })
  }

  static async resetCustomerPassword(customerId, password) {
    const passwordHash = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
      resetPassword(customerId, passwordHash, async (err, result) => {
        if (err) return reject(err);
        resolve('success')
      })
    }); 

  }


  static async verifyOTPFor(customerId, otp) {
    return new Promise((resolve, reject) => {
      retrieveOTPByNumber(customerId, async (err, result) => {
        if (err) return reject(err);
        if (!result || result.length === 0) return reject(new Error('OTP not found'));

        const otp_object = result[0];
        const currentTime = new Date();  // Ensure current time is in UTC
        const otpTimestamp = new Date(otp_object.updated_at);

        // Calculate the time difference in minutes
        const timeDifference = (currentTime - otpTimestamp)/60000; // Difference in minutes
        
        console.log(otp_object)
        console.log(currentTime)
        console.log(otpTimestamp)
        console.log(timeDifference)
        // Check if the OTP is within the 2-minute window
        if (timeDifference > 2) {
          console.log('expired')
          return reject('expired');
        }

        const isOtpValid = await bcrypt.compare(otp, otp_object.code_hash); 
        if (!isOtpValid) {
          console.log('invalid')
          return reject('invalid');
        }

        const accessToken = jwt.sign({ customerId, role: 'customer_auth', type: 'password' }, process.env.JWT_SECRET, { expiresIn: '10min' });
        console.log('valid')
        resolve({accessToken});
      }); 

    })
  }

  static async verifyOTP(customerId, otp) {
    return new Promise((resolve, reject) => {
      retrieveOTP(customerId, async (err, result) => {
        if (err) return reject(err);
        if (!result || result.length === 0) return reject(new Error('OTP not found'));

        const otp_object = result[0];
        const currentTime = new Date();  // Ensure current time is in UTC
        const otpTimestamp = new Date(otp_object.updated_at);

        // Calculate the time difference in minutes
        const timeDifference = (currentTime - otpTimestamp)/60000; // Difference in minutes
        
        console.log(otp_object)
        console.log(currentTime)
        console.log(otpTimestamp)
        console.log(timeDifference)
        // Check if the OTP is within the 2-minute window
        if (timeDifference > 2) {
          console.log('expired')
          return reject('expired');
        }

        const isOtpValid = await bcrypt.compare(otp, otp_object.code_hash); 
        if (!isOtpValid) {
          console.log('invalid')
          return reject('invalid');
        }

        const accessToken = jwt.sign({ customerId, role: 'customer_auth', type: 'password' }, process.env.JWT_SECRET, { expiresIn: '10min' });
        console.log('valid')
        resolve({accessToken});
      }); 

    })
  }

  static async verifyOTPLogin(customerId, contact, otp) {
    return new Promise((resolve, reject) => {
      retrieveOTP(contact, async (err, result) => {
        if (err) return reject(err);
        if (!result || result.length === 0) return reject(new Error('OTP not found'));

        const otp_object = result[0];
        const currentTime = new Date();  // Ensure current time is in UTC
        const otpTimestamp = new Date(otp_object.updated_at);

        // Calculate the time difference in minutes
        const timeDifference = (currentTime - otpTimestamp)/60000; // Difference in minutes
        
        console.log(otp_object)
        console.log(currentTime)
        console.log(otpTimestamp)
        console.log(timeDifference)
        // Check if the OTP is within the 2-minute window
        if (timeDifference > 2) {
          console.log('expired');
          return reject('expired');
        }
        
        const isOtpValid = await bcrypt.compare(otp, otp_object.code_hash); 
        if (!isOtpValid) {
          console.log('invalid')
          return reject('invalid');
        }

        const accessToken = jwt.sign({ customerId: customerId, role: 'customer' }, process.env.JWT_SECRET, { expiresIn: '48h' });
        console.log('valid');
        resolve(accessToken);
      }); 

    })
  }

  static generateRegisterToken(contact, otp) {
    const accessToken = jwt.sign({ contact, otp, role: 'register_auth' }, process.env.JWT_SECRET, { expiresIn: '10min' });
    return(accessToken)
  }

  static async generateLoginToken(customerId) {
    const accessToken = jwt.sign({ customerId: customerId, role: 'customer' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return(accessToken)
  }




  static async loginCustomer(phone, password) {
    return new Promise((resolve, reject) => {
      findCustomerByPhone(phone, async (err, results) => {
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
        if (!isValidPassword || username.toLowerCase()!='admin') {
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
