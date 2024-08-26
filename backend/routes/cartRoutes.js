const express = require('express');
const cartController = require('../controllers/cartController.js');
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post('/add', authMiddleware('customer'), cartController.addToCart);
router.get('/', authMiddleware('customer'), cartController.viewCart);
router.put('/update', authMiddleware('customer'), cartController.updateCartItem);
router.delete('/remove', authMiddleware('customer'), cartController.removeCartItem);

module.exports = router;
