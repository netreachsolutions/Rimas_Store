// PaymentConfirmation.js
import React, { useEffect, useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import axios from '../api/axios';
import { useAlert } from '../context/AlertContext';

const PaymentConfirmation = () => {
  const stripe = useStripe();
  const [paymentStatus, setPaymentStatus] = useState('processing');
  const [errorMessage, setErrorMessage] = useState('');
  const { showAlert } = useAlert();

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const clientSecret = urlParams.get('payment_intent_client_secret');
    const cartId = urlParams.get('cartId');
    const addressId = urlParams.get('addressId');

    if (clientSecret) {
      stripe.retrievePaymentIntent(clientSecret).then(async ({ paymentIntent }) => {
        switch (paymentIntent.status) {
          case 'succeeded':
            setPaymentStatus('success');

            // Proceed to confirm the order with your backend
            try {
              const token = localStorage.getItem('token');
              const response = await axios.post(
                '/api/orders/confirm',
                {
                  address_id: addressId,
                  cart_id: cartId,
                  payment_intent: paymentIntent.id,
                  currency: paymentIntent.currency,
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );

              if (response.data.success) {
                // Order confirmed successfully
                showAlert('Order confirmed!', 'success');
              } else {
                setErrorMessage('Error confirming the order.');
              }
            } catch (error) {
              console.error('Error confirming order:', error);
              setErrorMessage('Error confirming the order.');
            }

            break;
          case 'processing':
            setPaymentStatus('processing');
            break;
          case 'requires_payment_method':
            setPaymentStatus('failed');
            setErrorMessage('Payment failed. Please try again.');
            break;
          default:
            setPaymentStatus('unknown');
            setErrorMessage('Payment status unknown. Please contact support.');
            break;
        }
      });
    } else {
      setPaymentStatus('failed');
      setErrorMessage('No payment information found.');
    }
  }, [stripe]);

  return (
    <div className="payment-confirmation">
      {paymentStatus === 'success' && (
        <div>
          <h1>Payment Successful!</h1>
          <p>Thank you for your purchase! A confirmation email will be sent shortly.</p>
          {/* Link to continue shopping or view order details */}
        </div>
      )}
      {paymentStatus === 'processing' && <h1>Payment Processing...</h1>}
      {paymentStatus === 'failed' && (
        <div>
          <h1>Payment Failed</h1>
          <p>{errorMessage}</p>
          {/* Optionally, provide a link to retry payment */}
        </div>
      )}
      {paymentStatus === 'unknown' && (
        <div>
          <h1>Payment Status Unknown</h1>
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

export default PaymentConfirmation;
