import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

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
  const [paymentMethod, setPaymentMethod] = useState(''); // Added to track payment method choice
  
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
        setCartId(cartResponse.data.cartId); // Assuming you have cartId in response
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
    handleNextStep(); // Move to the payment selection step
  };

  const handlePaymentSelectionSubmit = async () => {
    if (paymentMethod === 'card') {
      // If card is selected, create Stripe payment intent
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
    } else {
      handleNextStep(); // For PayPal, no need to create a payment intent; just proceed to PayPal buttons
    }
  };

  const renderDeliveryStep = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">1. Select Delivery Address</h2>
      <form onSubmit={handleDeliverySubmit}>
        {deliveryDetails.addresses &&
          deliveryDetails.addresses.map((address) => (
            <div key={address.address_id} className="mb-2">
              <label className="block">
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
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Continue to Payment Selection
        </button>
      </form>
    </div>
  );

  const renderPaymentSelectionStep = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">2. Select Payment Method</h2>
      <div className="mb-4">
        <label className="block">
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Pay with Card (Stripe)
        </label>
        <label className="block mt-2">
          <input
            type="radio"
            name="paymentMethod"
            value="paypal"
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Pay with PayPal
        </label>
      </div>
      <button
        onClick={handlePaymentSelectionSubmit}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-300"
      >
        Continue to Payment
      </button>
    </div>
  );

  const renderPaymentStep = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">3. Payment Information</h2>
      {paymentMethod === 'card' && clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm
            clientSecret={clientSecret}
            deliveryDetails={deliveryDetails}
            cartId={cartId}
            setPaymentSuccess={setPaymentSuccess}
          />
        </Elements>
      )}

      {paymentMethod === 'paypal' && (
        <PayPalScriptProvider
          options={{
            "client-id": "AduDOTDNJSWRqOsSVLRZorTUX0jl071FpQBAtrHu-6Xg8sYnFT2ob1RxSZ54fVSrUlMQPe3WdROjH9Nq", // Replace with your PayPal client ID
            "currency": "USD",
            "intent": "capture"
          }}
        >
          <PayPalButtons
            createOrder={async () => {
              const token = localStorage.getItem('token');
              const response = await axios.get(
                '/api/orders/create-paypal-order',
                { headers: { Authorization: `Bearer ${token}` } }
              );
              const orderData = response.data;

              if (orderData.id) {
                return orderData.id; // Return the PayPal order ID
              } else {
                throw new Error('Order ID not found in server response');
              }           
            }}
            onApprove={async (data) => {
              const token = localStorage.getItem('token');
              const response = await axios.post(
                '/api/orders/confirm-paypal',
                {                  
                  paypalOrderId: data.orderID, 
                  address_id: deliveryDetails.address_id, 
                  currency: 'USD'
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              const orderData = response.data; // Access the parsed data directly
              setPaymentSuccess(true);
              console.log("PayPal transaction completed", orderData);
            }}
          />
        </PayPalScriptProvider>
      )}
    </div>
  );

  const renderReviewStep = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">4. Review and Confirm</h2>
      <ul>
        {cartItems.map((item) => (
          <li key={item.cart_item_id}>
            {item.name} - {item.quantity} x ${item.price.toFixed(2)}
          </li>
        ))}
      </ul>
      <p>Total: ${cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2)}</p>
      <button
        onClick={handleProceedToCheckout}
        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition duration-300 mt-4"
      >
        Confirm Order
      </button>
    </div>
  );

  const handleProceedToCheckout = () => {
    // Proceed to confirm the order
    alert('Order confirmed!');
    setPaymentSuccess(true);
  };

  return (
    <div className="container mx-auto my-8 p-4">
      {paymentSuccess ? (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Order Confirmed</h2>
          <p>Thank you for your purchase! A confirmation email will be sent shortly.</p>
        </div>
      ) : (
        <div>
          <div className={`mb-4 ${currentStep >= 1 ? 'opacity-100' : 'opacity-50'}`}>
            {renderDeliveryStep()}
          </div>
          <div className={`mb-4 ${currentStep >= 2 ? '```javascript
opacity-100' : 'opacity-50'}`}>
            {currentStep >= 2 && renderPaymentSelectionStep()}
          </div>
          <div className={`mb-4 ${currentStep >= 3 ? 'opacity-100' : 'opacity-50'}`}>
            {currentStep >= 3 && renderPaymentStep()}
          </div>
          <div className={`mb-4 ${currentStep >= 4 ? 'opacity-100' : 'opacity-50'}`}>
            {currentStep >= 4 && renderReviewStep()}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
