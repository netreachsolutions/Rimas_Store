import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../api/axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe('pk_test_51PApsjGBaVIQ3lGmE2o5Glfe1tOUor4CJiHmfLb2yxLUqXyzErTGruVfE2g2RsmicoxnETNdohTlN8b94QoAIghE00uMMRRfwB');

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [deliveryDetails, setDeliveryDetails] = useState({
    address_id: '',
  });
  const [cartId, setCartId] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const fetchAddressesAndCart = async () => {
      const token = localStorage.getItem('token');
      
      try {
        const profileResponse = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDeliveryDetails((prev) => ({
          ...prev,
          addresses: profileResponse.data.addresses,
        }));
        
        const cartResponse = await axios.get("/api/carts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(cartResponse.data.cartItems);
      } catch (error) {
        console.error("Error fetching profile or cart", error);
      }
    };

    fetchAddressesAndCart();
  }, []);

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleDeliverySubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        '/api/orders/create-intent',
        { paymentMethodType: 'card', currency: 'USD', cart_id: cartId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClientSecret(response.data.clientSecret);
      handleNextStep();
    } catch (error) {
      console.error("Error creating payment intent", error);
    }
  };

  const renderDeliveryStep = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">Select Delivery Address</h2>
      <form onSubmit={handleDeliverySubmit}>
        {deliveryDetails.addresses &&
          deliveryDetails.addresses.map((address) => (
            <div key={address.address_id}>
              <label>
                <input
                  type="radio"
                  name="address"
                  value={address.address_id}
                  onChange={(e) =>
                    setDeliveryDetails((prev) => ({
                      ...prev,
                      address_id: e.target.value,
                    }))
                  }
                />
                {address.first_line}, {address.city}, {address.postcode}, {address.country}
              </label>
            </div>
          ))}
        <button
          type="submit"
          className="bg-blue text-white px-6 py-2 rounded hover:bg-blue transition duration-300"
        >
          Continue to Payment
        </button>
      </form>
    </div>
  );

  const renderPaymentStep = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">Payment Information</h2>
      {clientSecret ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm
            clientSecret={clientSecret}
            deliveryDetails={deliveryDetails}
            cartId={cartId}
            setPaymentSuccess={setPaymentSuccess}
          />
        </Elements>
      ) : (
        <div>Loading payment...</div>
      )}
    </div>
  );

  const renderReviewStep = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">Review and Confirm</h2>
      <ul>
        {cartItems.map((item) => (
          <li key={item.cart_item_id}>
            {item.name} - {item.quantity} x ${item.price.toFixed(2)}
          </li>
        ))}
      </ul>
      <p>Total: ${cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2)}</p>
    </div>
  );

  return (
    <div className="container mx-auto my-8 p-4">
      {paymentSuccess ? (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Order Confirmed</h2>
          <p>Thank you for your purchase! A confirmation email will be sent shortly.</p>
        </div>
      ) : (
        <div>
          {currentStep === 1 && renderDeliveryStep()}
          {currentStep === 2 && renderPaymentStep()}
          {currentStep === 3 && renderReviewStep()}
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
