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
  static async createPaymentIntentFromCart(db, customerId, paymentMethodType, currency) {
    try {
      const cartItems = await CartService.viewCart(db, customerId);

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


  static async generateAccessToken() {
    // To base64 encode your client id and secret using NodeJs
    const BASE64_ENCODED_CLIENT_ID_AND_SECRET = Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const request = await fetch(
        "https://api-m.sandbox.paypal.com/v1/oauth2/token",
        {
            method: "POST",
            headers: {
                Authorization: `Basic ${BASE64_ENCODED_CLIENT_ID_AND_SECRET}`,
            },
            body: new URLSearchParams({
                grant_type: "client_credentials",
                response_type: "id_token",
                intent: "sdk_init",
            }),
        }
    );
    const json = await request.json();
    console.log('access token : ')
    console.log(json)
    return json.access_token;
}

static async validatePaypalOrder(paypalOrderId, accessToken, totalAmount) {
  try {
    // Fetch the PayPal order details
    console.log('Paypal Order ID to Validate: '+paypalOrderId)
    console.log('Access token for authorisation: '+accessToken)
    const response = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${paypalOrderId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch PayPal order. Status: ${response.status}`);
    }

    const fetchedOrder = await response.json();

    // Extract the amount from the PayPal order
    const paypalAmount = parseFloat(fetchedOrder.purchase_units[0].amount.value) * 100; // Convert to cents


    // Compare the amounts
    if (paypalAmount === totalAmount) {
      return { valid: true, message: "PayPal order amount matches the cart total." };
    } else {
      return { valid: false, message: `PayPal order amount (${paypalAmount / 100} USD) does not match the cart total (${totalAmount / 100} USD).` };
    }
  } catch (error) {
    console.error('Error validating PayPal order:', error);
    return { valid: false, message: `Error validating PayPal order: ${error.message}` };
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

  static async createPaypalOrderFromCart(db, customerId) {
    try {
      const cartItems = await CartService.viewCart(db, customerId);

      // Calculate the total amount
      let totalAmount = 0;
      cartItems.forEach(item => {
        totalAmount += item.price*100 * item.quantity; // Assuming each item has price and quantity fields
      });

      const shippingCost = 299; // Shipping cost in cents (2.99 GBP)
      totalAmount += shippingCost; // Add shipping cost to the total amount


    const accessToken = await this.generateAccessToken();

    const payload = {
      intent: "CAPTURE",
      purchase_units: [
          {
              amount: {
                  currency_code: "USD",
                  value: (totalAmount/100).toString(),
              },
          },
      ],
  };

  const paypalResponse = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        // Uncomment one of these to force an error for negative testing (in sandbox mode only).
        // Documentation: https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
        // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
    method: "POST",
    body: JSON.stringify(payload),
});

        // Parse the response body as JSON
        const responseData = await paypalResponse.json();

        console.log('paypal response: ', responseData);



      return responseData;
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      throw new Error(error.message);
    }
  }

  static async capturePaypalPayment(orderID, accessToken) {
    try {
      

  const paypalResponse = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        // Uncomment one of these to force an error for negative testing (in sandbox mode only).
        // Documentation: https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
        // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
});

        // Parse the response body as JSON
        const responseData = await paypalResponse.json();

        console.log('paypal response: ', responseData);



      return responseData;
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      throw new Error(error.message);
    }
  };

  static async recordPaypalPayment(db, paymentIntentId, orderId, totalAmount, currency) {
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
