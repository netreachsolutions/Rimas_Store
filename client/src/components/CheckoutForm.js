import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from '../api/axios';

const CheckoutForm = ({ clientSecret, deliveryDetails, cartId, setPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {},
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message);
        setIsProcessing(false);
        return;
      }

      // Send order confirmation to the backend
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/orders/confirm',
        {
          address_id: deliveryDetails.address_id,
          cart_id: cartId,
          payment_intent: paymentIntent.id,
          currency: paymentIntent.currency,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setPaymentSuccess(true);
      } else {
        setErrorMessage('Error confirming the order.');
      }

      setIsProcessing(false);
    } catch (error) {
      console.error('Error processing payment:', error);
      setErrorMessage('Error processing the payment.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={`w-full py-2 px-4 font-semibold text-white bg-black rounded-md ${isProcessing ? 'bg-gray-400' : 'hover:bg-black-700'}`}
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
      {errorMessage && <div className="text-red-600 mt-4">{errorMessage}</div>}
    </form>
  );
};

export default CheckoutForm;
