// services/paymentService.js

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createPayment } = require('../models/paymentModel');
const CartService = require('./cartService'); // Assuming you have a CartService that handles retrieving cart items

class PaymentService {
  /**
   * Create a payment intent for Stripe by calculating the total amount from the cart.
   * @param {string} cartId - The ID of the cart to calculate the total.
   * @param {string} paymentMethodType - The payment method type (e.g., 'card').
   * @param {string} currency - The currency in which the payment is made (e.g., 'gbp').
   * @returns {Promise<Object>} - Returns the Stripe client secret and any next actions.
   */
  static async createPaymentIntentFromCart(db, cartId, paymentMethodType, currency) {
    try {
      const cartItems = await CartService.viewCart(db, cartId);

      // Calculate the total amount
      let totalAmount = 0;
      cartItems.forEach(item => {
        totalAmount += item.price*100 * item.quantity; // Assuming each item has price and quantity fields
      });

      const shippingCost = 299; // Shipping cost in cents (2.99 GBP)
      totalAmount += shippingCost; // Add shipping cost to the total amount

      const params = {
        payment_method_types: [paymentMethodType],
        amount: totalAmount, // Total amount in the smallest currency unit (e.g., cents)
        currency: currency,
      };

      const paymentIntent = await stripe.paymentIntents.create(params);

      return {
        clientSecret: paymentIntent.client_secret,
        nextAction: paymentIntent.next_action,
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error(error.message);
    }
  }

 static async validatePaymentIntent(paymentIntentId) {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status === 'succeeded') {
        return true;
    }
    return false;
};

  static async recordPayment(db, paymentIntentId, orderId, totalAmount, currency) {
    return new Promise((resolve, reject) => {
       const paymentData = { 
        order_id: orderId, 
        processor_id: paymentIntentId, 
        amount: totalAmount, 
        currency, 
        paymentStatus: 'completed' 
      }
       createPayment(db, paymentData, (err, result) => {
        if (err) {
          console.error('Error creating product image:', err);
          return reject(err); // Reject if there's an error creating the product image
        }

        console.log(`Payment Saved to DB`);

        // Resolve the promise after both product and image are successfully created
        resolve({
          message: 'Payment Saved to DB',
        });
      });

    });
  }
}

module.exports = PaymentService;
