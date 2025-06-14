// routes/CustomerRoutes.js
const express = require("express");
const customerController = require("../controllers/customerController");
const productController = require('../controllers/productController')
const authMiddleware = require("../middlewares/authMiddleware");


const router = express.Router({mergeParams: true});

// router.post("/register", customerController.registerCustomer);
router.post("/custom-order-request", authMiddleware('customer'), customerController.customOrderRequest);
router.post("/register", authMiddleware('register_auth'), customerController.registerCustomer2);
router.post("/login", customerController.loginCustomer);
router.post("/otp", customerController.initiateOTP);
router.post("/otp/verify", customerController.verifyOTP);
router.get("/products", productController.getAllProducts);
router.get("/products/:id", productController.getProductById);
router.post("/address/new", authMiddleware('customer'), customerController.addAddress);
router.get("/profile", authMiddleware('customer'), customerController.customerProfile);
router.post("/updateProfile", authMiddleware('customer'), customerController.updateCustomerField)
router.get("/verify", authMiddleware('customer'), customerController.validateCustomerToken);
router.post("/reset", authMiddleware('customer_auth'), customerController.updatePassword);


module.exports = router;
