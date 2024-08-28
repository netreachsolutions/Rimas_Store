const db = require("../config/db");
const paymentService = require('../services/paymentService')

exports.createPaymentIntent = async (req, res) => {
    const { paymentMethodType, currency } = req.body;

    const customerId = req.tokenAssets.customerId;


      try {
        const {clientSecret, nextAction} = await paymentService.createPaymentIntentFromCart( db, customerId, paymentMethodType, currency );
        res.send({
            clientSecret: clientSecret,
            nextAction: nextAction,
          });
      } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(400).json({ message: error.message });
      }
  };

exports.createPaypalOrder = async (req, res) => {
  console.log('create paypal order request recieved!');
  const customerId = req.tokenAssets.customerId; 
  
  try {
    const response = await paymentService.createPaypalOrderFromCart(db, customerId);
    console.log(response)
    res.send(response);
  } catch (error) {
    console.error('Error creating paypal order:', error);
    res.status(400).json({ message: error.message });
  }

}