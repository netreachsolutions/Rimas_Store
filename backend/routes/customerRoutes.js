// routes/CustomerRoutes.js
const express = require("express");
const customerController = require("../controllers/customerController");
const productController = require('../controllers/productController')
const authMiddleware = require("../middlewares/authMiddleware");


const router = express.Router({mergeParams: true});

router.post("/register", customerController.registerCustomer);
router.post("/login", customerController.loginCustomer);
router.post("/otp", customerController.initiateOTP);
router.post("/otp/verify", customerController.verifyOTP);
router.get("/products", productController.getAllProducts);
router.get("/products/:id", productController.getProductById);
router.post("/address/new", authMiddleware('customer'), customerController.addAddress);
router.get("/profile", authMiddleware('customer'), customerController.customerProfile);
router.get("/verify", authMiddleware('customer'), customerController.validateCustomerToken);


module.exports = router;
