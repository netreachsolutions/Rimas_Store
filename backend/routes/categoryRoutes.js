const express = require('express');
const categoryController = require('../controllers/categoryController.js');
const productController = require('../controllers/productController.js');
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get('/', categoryController.retrieveAllCategories);
router.get('/categoriesWithCount', categoryController.getAllCategoriesWithCount);
router.get('/:categoryId', productController.getProductsByCategory);
router.delete('/deleteCategories', categoryController.deleteCategoriesByIDs);
router.post('/create', authMiddleware('admin'), categoryController.createCategory);
router.post('/addProduct', authMiddleware('admin'), categoryController.addProductsToCategory);

module.exports = router;
