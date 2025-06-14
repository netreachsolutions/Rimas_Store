const db = require('../config/db');
const CartService = require('../services/cartService');
const OrderService = require('../services/orderService');
const orderService = require('../services/orderService');
const PaymentService = require('../services/paymentService');
const paymentService = require('../services/paymentService');
const customerService = require('../services/customerService');
const notificationService = require('../services/notificationService');
const {sendEmail, sendSMS} = require('../config/emailConfig');
const ProductService = require('../services/productService');

exports.createOrder = async (req, res) => {
    const { payment_intent, address_id, currency } = req.body;
    const { customerId } = req.tokenAssets; // Ensure customer ID is attached to the token

    try {
        // Step 1: Validate Payment Intent
        const isPaymentValid = await paymentService.validatePaymentIntent(payment_intent);
        if (!isPaymentValid) {
            return res.status(400).json({ message: 'Invalid payment intent' });
        }

        // Step 2: Fetch cart items from the database using cart_id
        const cartItems = await CartService.viewCart(customerId);
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty or invalid' });
        }

        // Step 3: Calculate total price of the order (including shipping)
        // const totalAmount = cartItems.reduce((total, item) => total + (item.quantity * item.price * 100), 0);
        const totalWeight = cartItems.reduce((total, item) => total + (item.quantity * item.product_weight), 0);
        const {totalAmount, shippingCost} = await paymentService.calculateCartTotal(customerId)
        console.log(`TotalAmount: ${totalAmount}`)

        // Step 4: Create Order in the database (transaction)
        const orderId = await orderService.createOrder(customerId, address_id, cartItems, totalAmount, shippingCost, totalWeight);


        // Step 5: Mark payment as completed and associate with the order
        await paymentService.recordPayment(payment_intent, orderId, totalAmount, currency);

        // Step 6: Clear the cart after order creation
        await CartService.clearCart(customerId);

        await ProductService.updateStock(cartItems);
        // Step 7: Send email confirmation to user 
        await notificationService.sendOrderProcessingNotification(orderId)
        // const customerProfile = await customerService.getCustomerProfile(customerId);
        // const emailMsg = {
        //   to: customerProfile.email,
        //   subject: 'RIMAS Order Confirmation',
        //   text: `Thank you for your order! Your order number is #${orderId}.`,
        //   html: `
        //     <h1>Order Confirmation</h1>
        //     <p>Thank you for your purchase, ${customerProfile.customer_name}!</p>
        //     <p>Your order number is #${orderId}.</p>
        //     <p>We'll notify you once your order has been shipped.</p>
        //     <br>
        //     <p>Rimas Store Limited</p>
        //   `,
        // };
        // await sendEmail(emailMsg);

        // if (customerProfile.phone_number) {
        //   await sendSMS(`Order Confirmed! \n#Your order number is #${orderId}\n\nRimas Store Ltd.`, customerProfile.phone_number)

        // }


        // Step 8: Send order confirmation response
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            orderId: orderId,
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Failed to create order' });
    }
};

exports.confirmPayapalOrder = async (req, res) => {
  const { paypalOrderId, address_id, currency } = req.body;
  const { customerId } = req.tokenAssets; // Ensure customer ID is attached to the token

  try {
      // Get access token
      const accessToken = await PaymentService.generateAccessToken();

          // Retrieve the cart items for the customer
    const cartItems = await CartService.viewCart(customerId);

      // // Calculate the total amount in the cart
      // let totalAmount = 0;
      // cartItems.forEach(item => {
      //   totalAmount += item.price * 100 * item.quantity; // Convert price to cents and sum up
      // });

      // const shippingCost = 299; // Shipping cost in cents (2.99 GBP)
      // totalAmount = (totalAmount*100) + shippingCost; // Add shipping cost to the total amount
      const totalWeight = cartItems.reduce((total, item) => total + (item.quantity * item.product_weight), 0);
      const {totalAmount, shippingCost} = await paymentService.calculateCartTotal(customerId);

      // Step 1: Validate Payment Intent
      const isPaymentValid = await paymentService.validatePaypalOrder(paypalOrderId, accessToken, totalAmount);
      if (!isPaymentValid.valid) {
          return res.status(400).json({ message: 'Invalid paypal order' });
      }

      // attempt payment capture
      await paymentService.capturePaypalPayment(paypalOrderId, accessToken);

      // Step 4: Create Order in the database (transaction)
      const orderId = await orderService.createOrder(customerId, address_id, cartItems, totalAmount, shippingCost, totalWeight);

      // Step 5: Mark payment as completed and associate with the order
      await paymentService.recordPayment(paypalOrderId, orderId, totalAmount, currency);

      // Step 6: Clear the cart after order creation
      await CartService.clearCart(customerId);

      // Step 7: Send email confirmation to user 
      await notificationService.sendOrderProcessingNotification(orderId)
      // const customerProfile = await customerService.getCustomerProfile(customerId);
      // const emailMsg = {
      //   to: customerProfile.email,
      //   subject: 'RIMAS Order Confirmation',
      //   text: `Thank you for your order! Your order number is #${orderId}.`,
      //   html: `
      //     <h1>Order Confirmation</h1>
      //     <p>Thank you for your purchase, ${customerProfile.customer_name}!</p>
      //     <p>Your order number is #${orderId}.</p>
      //     <p>We'll notify you once your order has been shipped.</p>
      //     <br>
      //     <p>Rimas Store Limited</p>
      //   `,
      // };
      // await sendEmail(emailMsg);

      // if (customerProfile.phone_number) {
      //   await sendSMS(`Order Confirmed! \n#Your order number is #${orderId}\n\nRimas Store Ltd.`, customerProfile.phone_number)

      // }

      // Step 8: Send order confirmation response
      res.status(201).json({
          success: true,
          message: 'Order created successfully',
          orderId: orderId,
      });
  } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ message: 'Failed to create order' });
  }
};

exports.getAllOrders = async (req, res) => {
    try {
      // Call the service to get all orders
      const orders = await OrderService.getAllOrders(db);
  
      // Send the orders as a response
      res.status(200).json({ orders });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ message: 'Failed to fetch orders' });
    }
  };

  exports.updateDeliveryStatus = async (req, res) => {
    const { order_id } = req.params;
    const { delivery_status, tracking_id, courier} = req.body;
    console.log(req.body)

    try {
        await orderService.updateDeliveryStatus(order_id, delivery_status, tracking_id, courier);

        await notificationService.sendOrderDispatchedNotification(order_id);

        
        res.status(200).json({ message: 'Delivery status updated successfully' });

    } catch (error) {
        console.error('Error updating delivery status:', error);
        res.status(500).json({ message: 'Failed to update delivery status' });
    }
};

exports.getOrderDetails = async (req, res) => {
    const { orderId } = req.params;
    console.log('Order ID: '+orderId)
    try {
      const orderDetails = await orderService.getOrderDetails(orderId);
      if (!orderDetails) {
        return res.status(404).json({ message: 'Order not found' });
      }
      console.log(orderDetails);
      res.status(200).json({ orderDetails });
    } catch (error) {
      console.error('Error fetching order details:', error);
      res.status(500).json({ message: 'Failed to fetch order details' });
    }
  };

  exports.getOrderItems = async (req, res) => {
    const { orderId } = req.params;
    console.log('Order ID: '+orderId)
    try {
      const orderItems = await orderService.getOrderItems(orderId);
      if (!orderItems) {
        return res.status(404).json({ message: 'Order not found' });
      }
      console.log(orderItems);
      res.status(200).json({ orderItems });
    } catch (error) {
      console.error('Error fetching order details:', error);
      res.status(500).json({ message: 'Failed to fetch order details' });
    }
  };

  exports.getCustomerOrders = async (req, res) => {
    const { customerId } = req.tokenAssets; // Ensure customer ID is attached to the token
    try {
      const orders = await orderService.getCustomerOrders(customerId);
      console.log(orders);
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ message: 'Failed to fetch orders' });
    }
  };

