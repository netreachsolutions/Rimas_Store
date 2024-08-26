const express = require('express');
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/authMiddleware');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.post('/create-intent', authMiddleware('customer'), paymentController.createPaymentIntent);
router.post("/confirm", authMiddleware("customer"), orderController.createOrder);
router.get('/', authMiddleware('admin'), orderController.getAllOrders)
router.put('/:order_id/status', authMiddleware('admin'), orderController.updateDeliveryStatus);
router.get('/:orderId/details', authMiddleware('admin'), orderController.getOrderDetails);



module.exports = router;
