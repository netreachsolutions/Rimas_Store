// controllers/AdminController.js
const AuthService = require("../services/authService");


exports.loginAdmin = async (req, res) => {
  try {
    const { username, password, timestamp } = req.body;
    const tokens = await AuthService.loginAdmin(username, password, timestamp);
    console.log('login success')
    res.json(tokens);
  } catch (error) {
    console.error('Error during login:', error);
    res.status(400).json({ message: error.message });
  }
};

// validate access token to redirect to login page on client side
exports.validateAdminToken = (req, res) => {
    res.json('success')
};
