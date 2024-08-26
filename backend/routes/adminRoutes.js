// routes/adminRoutes.js
const express = require("express");
const adminController = require('../controllers/adminController')
const productController = require('../controllers/productController')
const authMiddleware = require("../middlewares/authMiddleware");


const router = express.Router();

router.post("/login", adminController.loginAdmin);
router.post("/saveProduct", authMiddleware('admin'), productController.saveProduct);
router.get("/verify", authMiddleware('admin'), adminController.validateAdminToken);

module.exports = router;