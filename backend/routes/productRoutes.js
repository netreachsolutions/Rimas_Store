const express = require('express');
const productController = require('../controllers/productController.js');
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post('/filter', productController.getProductsByFilters);
router.post('/status', authMiddleware('admin'), productController.updateProductStatus);

module.exports = router;