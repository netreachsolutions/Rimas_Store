// services/userService.js
const { resolve } = require('path');
const { findAddressByCustomerId, createAddress, setAllCustomerAddressFalse, setDefaultAddress } = require('../models/addressModel');
const { findCustomerById, findCustomerByEmail, updateField, findCustomerByPhone } = require('../models/customerModel')
const AuthService = require("../services/authService");
const { reject } = require('bcrypt/promises');


class CustomerService {
  static async getCustomerProfile(customerId) {
    return new Promise((resolve, reject) => {
      // Fetch customer details
      findCustomerById(customerId, (err, customerResults) => {
        if (err) return reject(err);
  
        if (customerResults.length === 0) {
          return reject(new Error("Customer not found"));
        }
  
        const customer = customerResults[0];
  
        // Fetch addresses related to the customer
        findAddressByCustomerId(customerId, (err, addressResults) => {
          if (err) return reject(err);
  
          // Attach addresses to the customer object
          customer.addresses = addressResults;
  
          // Resolve with the combined customer and addresses
          resolve(customer);
        });
      });
    });
  }

  static async getCustomerByEmail(email) {
    return new Promise((resolve, reject) => {
      // Fetch customer details
      findCustomerByEmail(email, (err, customerResults) => {
        if (err) return reject(err);
  
        // if (customerResults.length === 0) {
        //   return reject(new Error("Customer not found"));
        // }
  
        const customer = customerResults;
  
        resolve(customer[0]);
      });
    });
  }

  static async getCustomerByPhone(phone) {
    return new Promise((resolve, reject) => {
      // Fetch customer details
      findCustomerByPhone(phone, (err, customerResults) => {
        if (err) return reject(err);
  
        // if (customerResults.length === 0) {
        //   return reject(new Error("Customer not found"));
        // }
  
        const customer = customerResults;
  
        resolve(customer[0]);
      });
    });
  }
  

  static async createCustomerAddress(addressData) {
    return new Promise((resolve, reject) => {
      createAddress(addressData, async (err, results) => {
        if (err) return reject(err);

        const address = results[0];
        console.log('created address below')
        console.log(address)
      });
      resolve('address successfully created')
    })
  }


  static async setDefaultCustomerAddress(customerId, addressId) {
    return new Promise((resolve, reject) => {
      setAllCustomerAddressFalse(customerId, async (err, results) => {
        if (err) return reject(err);
      });

      setDefaultAddress(customerId, addressId, async (err, results) => {
        if (err) return reject(err);
      })

      resolve('address successfully created')
    })
  }

  static async updateCustomerField(customerId, fieldName, value) {
    console.log(fieldName)
    return new Promise((resolve, reject) => {
      updateField(customerId, fieldName, value, async (err, results) => {
        if (err) return reject(err);

        resolve('customer detials successfully updated')
    })
    })
  }


  


}

module.exports = CustomerService;
