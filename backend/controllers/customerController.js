// controllers/CustomerController.js
const AuthService = require("../services/authService");
const db = require("../config/db");
const customerService = require("../services/customerService");
const authMiddleware = require("../middlewares/authMiddleware");

exports.registerCustomer = async (req, res) => {
  try {
    const CustomerData = req.body;
    await AuthService.registerCustomer(db, CustomerData);
    res.status(201).json({ message: "Customer registered successfully" });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Customer registration failed' });
  }
};

exports.loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const tokens = await AuthService.loginCustomer(db, email, password);
    console.log('login success')
    res.json(tokens);
  } catch (error) {
    console.error('Error during login:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.customerProfile = async (req, res) => {
    try {
      const { customerId } = req.tokenAssets;
      console.log(`attemting to retrieve profile with custID:${customerId}...`)
      const customer = await customerService.getCustomerProfile(db, customerId);
      console.log(customer)
      res.json(customer);
    } catch (error) {
      console.error('Error during fetch:', error);
      res.status(400).json({ message: error.message });
    }
  };

exports.addAddress = async (req, res) => {
  try {
    const { customerId } = req.tokenAssets;
    const { address } = req.body;
    address.customerId = customerId;
    console.log(`attemting to add address to customerID:${customerId}...`)
    console.log(address)
    await customerService.createCustomerAddress(db, address);
    res.json('successfully added address');
  } catch (error) {
    console.error('Error during address creation:', error);
    res.status(400).json({ message: error.message });
  }
}

// validate access token to redirect to login page on client side
exports.validateCustomerToken = (req, res) => {
  res.json('success')
} 

