// routes/adminRoutes.js
const express = require("express");
const adminController = require('../controllers/adminController')
const productController = require('../controllers/productController')
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require('../config/multerConfig');

const router = express.Router();

router.post("/login", adminController.loginAdmin);
// router.post("/saveProduct", authMiddleware('admin'), productController.saveProduct);
router.post('/saveProduct', authMiddleware('admin'), upload.array('files', 10), productController.saveProduct); // `files` is the field name for the files
router.get("/verify", authMiddleware('admin'), adminController.validateAdminToken);

module.exports = router;