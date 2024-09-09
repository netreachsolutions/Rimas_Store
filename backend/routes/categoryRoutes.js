const express = require('express');
const categoryController = require('../controllers/categoryController.js');
const productController = require('../controllers/productController.js');
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get('/', categoryController.retrieveAllCategories);
router.get('/categoriesWithCount', categoryController.getAllCategoriesWithCount);
router.get('/type', categoryController.retrieveCategoriesByType),
router.get('/:categoryId/products', productController.getProductsByCategory);
router.get('/:categoryId', categoryController.getCategory);
router.get('/:categoryId/productsNotInCategory', categoryController.getAllProductsNotInCategory);
router.delete('/deleteCategories', categoryController.deleteCategoriesByIDs);
router.delete('/deleteProducts', categoryController.deleteProducts);
router.post('/create', authMiddleware('admin'), categoryController.createCategory);
router.post('/addProduct', authMiddleware('admin'), categoryController.addProductsToCategory);

module.exports = router;
