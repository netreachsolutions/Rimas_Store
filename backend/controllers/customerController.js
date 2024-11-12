// controllers/CustomerController.js
const AuthService = require("../services/authService");
const db = require("../config/db");
const customerService = require("../services/customerService");
const authMiddleware = require("../middlewares/authMiddleware");
const NotificationService = require("../services/notificationService");
const { resolve } = require("path");
const { response } = require("express");

exports.registerCustomer = async (req, res) => {
  try {
    const CustomerData = req.body;
    await AuthService.registerCustomer(CustomerData);
    res.status(201).json({ message: "Customer registered successfully" });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Customer registration failed' });
  }
};

exports.registerCustomer2 = async (req, res) => {
  console.log('authorised')
  const tokenAssets = req.tokenAssets;
  console.log(tokenAssets)
  const {phone, email, name, otp, method} = req.body
  try {
    if (method == 'phone') {
      if (phone == tokenAssets.contact || otp == tokenAssets.otp) {
        const response = await AuthService.registerCustomer2(name, phone);
        console.log('loginToken')
        console.log(response)
        res.status(201).json({token: response, type: 'login'});
      } else {
        new Error('Invalid email or password')
  
      }
      
    } else if (method == 'email') {
      if (email == tokenAssets.contact || otp == tokenAssets.otp) {
        const response = await AuthService.registerCustomer2(name, email);
        console.log('loginToken')
        console.log(response)
        res.status(201).json({token: response, type: 'login'});
      } else {
        new Error('Invalid email or password')
  
      }
    }

  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Customer registration failed' });
  }
};

exports.loginCustomer = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const tokens = await AuthService.loginCustomer(phone, password);
    console.log('login success')
    res.json(tokens);
  } catch (error) {
    console.error('Error during login:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.initiateOTP = async (req, res) => {
  try {
    const { extention, phone_number, email, method } = req.body;
    if (method == 'phone') {
      const phone = extention + phone_number;
      console.log(phone)
      const otp = await AuthService.generateOTP(phone);
      await NotificationService.sendOTP(method, phone, otp);
    } else if (method == 'email') {
      const otp = await AuthService.generateOTP(email);
      await NotificationService.sendOTP(method, email, otp);
    }
    res.send({message: 'code sent'});
    // if (customerResults.length > 0) {
    //   const customerDetails = await customerService.getCustomerByPhone(phone);
    // }
    // if (email) {
    //   const customerDetails = await customerService.getCustomerByEmail(email);
    // }
  } catch (error) {
    console.error('Error during fetch:', error);
    res.status(400).json({ message: error.message });
  }
}

exports.verifyOTP = async (req, res) => {
  try {
    const { otp, extention, phone_number, email, method } = req.body;

    if (method == 'phone') {
      // phone
      const phone = extention + phone_number;
      console.log(otp)
      console.log(phone)
      const customerDetails = await customerService.getCustomerByPhone(phone);
      if (customerDetails) {
        const response = await AuthService.verifyOTPLogin(customerDetails.customer_id, customerDetails.phone_number, otp);
        res.json({token: response, type: 'login'});
      } else {
        const response = AuthService.generateRegisterToken(phone, otp);
        console.log(response.toString)
        res.json({token: response.toString(), type: 'register'});
      }
      console.log('approved')
    } else if (method == 'email') {
      // email
      const customerDetails = await customerService.getCustomerByEmail(email);
      if (customerDetails) {
        const response = await AuthService.verifyOTPLogin(customerDetails.customer_id, customerDetails.email, otp);
        res.json({token: response, type: 'login'});
      } else {
        const response = AuthService.generateRegisterToken(email, otp);
        console.log(response.toString)
        res.json({token: response.toString(), type: 'register'});
      }
    }

    console.log('approved')
  } catch (error) {
    console.error(error)
    res.status(403).json({message: error.message})
  }
}

exports.updatePassword = async (req, res) => {
  console.log('authenticated')
  try {
    const { customerId } = req.tokenAssets;
    const {phone, pass} = req.body;
    // const customerDetails = await customerService.getCustomerByEmail(email);
    const customerDetails = await customerService.getCustomerByPhone(phone);    
    if (customerDetails.customer_id != customerId) {
      res.status(403).json({message: 'unauthorised'})
    }
    await AuthService.resetCustomerPassword(customerId, pass);
    res.json('success')
  } catch (error) {
    console.log(error)
    res.status(403).json({message: error.message})
  }
}

// exports.requestAccess = async (req, res) => {
//   try {
//     const { customerId };

//   } catch (error) {

//   }
// }

exports.customerProfile = async (req, res) => {
    try {
      const { customerId } = req.tokenAssets;
      console.log(`attemting to retrieve profile with custID:${customerId}...`)
      const customer = await customerService.getCustomerProfile(customerId);
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
    console.log(`attemting to add address to customerID:${customerId}...`);
    console.log(address)
    await customerService.createCustomerAddress(address);
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

exports.updateCustomerField = async (req, res) => {
  try {
    const {customerId} = req.tokenAssets;
    console.log(req.body)
    const {fieldName, value} = req.body;
    console.log(fieldName)
    await customerService.updateCustomerField(customerId, fieldName, value);
    res.json('successfully updated customer details');
  } catch (error) {
    console.error("Error during updating customer field", error);
    res.status(400).json({message: error.message})
  }
};

exports.customOrderRequest = async (req, res) => {
  try {
    const {customerId} = req.tokenAssets
    const { address_id, message } = req.body;

    // Validate input as needed

    await NotificationService.sendCustomOrderRequestNotification(customerId, address_id, message);

    res.status(200).json({ message: 'Custom order request sent successfully' });
  } catch (error) {
    console.error('Error processing custom order request:', error);
    res.status(500).json({ error: 'Failed to process custom order request' });
  }
};

