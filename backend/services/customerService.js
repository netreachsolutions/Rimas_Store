// services/userService.js
const { resolve } = require('path');
const { findAddressByCustomerId, createAddress, setAllCustomerAddressFalse, setDefaultAddress } = require('../models/addressModel');
const { findCustomerById } = require('../models/customerModel')
const AuthService = require("../services/authService");


class CustomerService {
  static async getCustomerProfile(db, customerId) {
    return new Promise((resolve, reject) => {
      // Fetch customer details
      findCustomerById(db, customerId, (err, customerResults) => {
        if (err) return reject(err);
  
        if (customerResults.length === 0) {
          return reject(new Error("Customer not found"));
        }
  
        const customer = customerResults[0];
  
        // Fetch addresses related to the customer
        findAddressByCustomerId(db, customerId, (err, addressResults) => {
          if (err) return reject(err);
  
          // Attach addresses to the customer object
          customer.addresses = addressResults;
  
          // Resolve with the combined customer and addresses
          resolve(customer);
        });
      });
    });
  }
  

  static async createCustomerAddress(db, addressData) {
    return new Promise((resolve, reject) => {
      createAddress(db, addressData, async (err, results) => {
        if (err) return reject(err);

        const address = results[0];
        console.log('created address below')
        console.log(address)
      });
      resolve('address successfully created')
    })
  }


  static async setDefaultCustomerAddress(db, customerId, addressId) {
    return new Promise((resolve, reject) => {
      setAllCustomerAddressFalse(db, customerId, async (err, results) => {
        if (err) return reject(err);
      });

      setDefaultAddress(db, customerId, addressId, async (err, results) => {
        if (err) return reject(err);
      })

      resolve('address successfully created')
    })
  }

  


}

module.exports = CustomerService;
