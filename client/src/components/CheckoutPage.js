import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import NewAddress from "./NewAddress";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "../context/AlertContext";
import AcceptedPaymentMethods from "./AcceptedPaymentMethods";

const stripePromise = loadStripe('pk_test_51PApsjGBaVIQ3lGmE2o5Glfe1tOUor4CJiHmfLb2yxLUqXyzErTGruVfE2g2RsmicoxnETNdohTlN8b94QoAIghE00uMMRRfwB');

const CheckoutPage = () => {
  const navigate = useNavigate();
  const {showAlert} = useAlert();
  const [backdropPosition, setBackdropPosition] = useState('hidden');
  const [cartItems, setCartItems] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  // const [deliveryDetails, setDeliveryDetails] = useState({
  //   address_id: '',
  // });
    const [deliveryDetails, setDeliveryDetails] = useState(null)
  const [cartId, setCartId] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);
  const [itemsAmount, setItemsAmount] = useState(null);
  const [deliveryAmount, setDeliveryAmount] = useState(null);

  const [paymentLoading, setPaymentLoading] = useState(true); // Add loading state
  const [clientSecret, setClientSecret] = useState("");
  const [paypalOrderId, setPaypalOrderId] = useState(null);
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
        if (cartResponse.data.cartItems.length === 0) {
          navigate('/cart');
          return;
        }
        setCartItems(cartResponse.data.cartItems);
        setTotalAmount(cartResponse.data.price.total);
        setDeliveryAmount(cartResponse.data.price.delivery);
        setItemsAmount(cartResponse.data.price.items);

        setCartId(cartResponse.data.cartId); // Assuming you have cartId in response
      } catch (error) {
        console.error("Error fetching profile or cart", error);
      }
    };

    fetchAddressesAndCart();
  }, []);

  const resetDelivery = () => {
    setDeliveryDetails((prev) => ({
      ...prev,
      address_id: null,
    }))
    setCurrentStep(1)
  }

  function trimString(str) {
    const maxChars = 12;
    return str.length > maxChars ? str.substring(0, maxChars) + ".." : str;
}

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleDeliverySubmit = async (e) => {
    e.preventDefault();
    if (deliveryDetails == null || deliveryDetails.addresses.length == 0 || !deliveryDetails?.address_id) {
      showAlert("Please Select An Address", 'warning')
    } else {

      handleNextStep(); // Move to the payment selection step

    }
  };

  const handlePaymentSelectionSubmit = async () => {
    if (paymentMethod == '') {
      showAlert('Please select Payment Method', 'warning')
    }
    else if (paymentMethod === 'card') {
      // If card is selected, create Stripe payment intent
      const token = localStorage.getItem('token');
      try {
        const response = await axios.post(
          '/api/orders/create-intent',
          { paymentMethodType: 'card', currency: 'GBP', cart_id: cartId },
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

  const handleAddressAdded = async () => {
    setBackdropPosition('hidden');
    const token = localStorage.getItem('token');
    try {
      const profileResponse = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeliveryDetails((prev) => ({
        ...prev,
        addresses: profileResponse.data.addresses,
      }));
    } catch (error) {
      console.error('Error refreshing profile data:', error);
    }
  };

  const handleAddressSelection = (e) => {
    setDeliveryDetails((prev) => ({
      ...prev,
      address_id: e.target.value,
    }))

  }

  const renderDeliveryStep = () => (
    <div>
    { (currentStep == 1 ? (
          <form onSubmit={handleDeliverySubmit}>
            {deliveryDetails?.addresses &&
              deliveryDetails.addresses.map((address) => (
                <div key={address.address_id} className="mb-2">
                  <label className="block">
                    <input
                      type="radio"
                      name="address"
                      value={address.address_id}
                      onChange={(e) =>
                        handleAddressSelection(e)
                      }
                    />
                    {address.first_line}, {address.city}, {address.postcode}, {address.country}
                  </label>
                </div>
              ))}
                          <div className="mb-2">
                  <button 
                    className={`${currentStep == 1 ? 'auto' : 'hidden'} w-max text-blue-500 hover:underline hover:cursor-pointer`}
                    onClick={() => setBackdropPosition('fixed')}
                    >
                    + New Address
                  </button>
                </div>
            <button
              type="submit"
              className={`bg-blue-500 mr-2 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-300 ${currentStep == 1 ? 'auto' : 'hidden'}`}
            >
              Use this address
            </button>
          </form>
      
    ) : (
      <div className="flex gap-5">
        <div>{deliveryDetails?.addresses[0].first_line}, {deliveryDetails?.addresses[0].city}, {deliveryDetails?.addresses[0].postcode}, {deliveryDetails?.addresses[0].country}</div>
        <button 
          className={`w-max text-blue-500 hover:underline hover:cursor-pointer`}
          onClick={() => resetDelivery()}
        >
          Change
        </button>      
      </div>

    )
    
  )}
  </div>
  );

  const handlePaymentSelect = (paymentType) => {
    setPaymentMethod(paymentType);
    setCurrentStep(2)
  }

  const renderPaymentSelectionStep = () => (
    <div>
      <div className="mb-4">
        <label className="block">
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            onChange={(e) => handlePaymentSelect(e.target.value)}
          />
          Pay with Card (Stripe)
        </label>
        <label className="block mt-2">
          <input
            type="radio"
            name="paymentMethod"
            value="paypal"
            onChange={(e) => handlePaymentSelect(e.target.value)}
          />
          Pay with PayPal
        </label>
      </div>
      <button
        onClick={handlePaymentSelectionSubmit}
        className={`bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-300 ${currentStep == 2 ? 'auto' : 'hidden'}`}
        >
        Continue to Payment
      </button>
    </div>
  );

  useEffect(() => {
    if (paymentMethod === 'card' && clientSecret) {
      setPaymentLoading(false); // Stop loading when clientSecret is set
    } else if (paymentMethod === 'paypal' && paypalOrderId) {
      setPaymentLoading(false); // Stop loading when PayPal order ID is set
    }
  }, [clientSecret, paypalOrderId]);

  // const renderPaymentStep = () => {

  //      paymentLoading ? (<div>Loading...</div>) : (
  //     <div>
  //       {paymentMethod === 'card' && clientSecret && (
  //         <Elements stripe={stripePromise} options={{ clientSecret }}>
  //           <CheckoutForm
  //             clientSecret={clientSecret}
  //             deliveryDetails={deliveryDetails}
  //             cartId={cartId}
  //             setPaymentSuccess={setPaymentSuccess}
  //           />
  //         </Elements>
  //       )}
  
  //       {paymentMethod === 'paypal' && (
  //         <PayPalScriptProvider
  //           options={{
  //             "client-id": "AduDOTDNJSWRqOsSVLRZorTUX0jl071FpQBAtrHu-6Xg8sYnFT2ob1RxSZ54fVSrUlMQPe3WdROjH9Nq", // Replace with your PayPal client ID
  //             "currency": "USD",
  //             "intent": "capture"
  //           }}
  //         >
  //           <PayPalButtons
  //             createOrder={async () => {
  //               setPaymentLoading(true); // Start loading while creating PayPal order
  //               const token = localStorage.getItem('token');
  //               const response = await axios.get(
  //                 '/api/orders/create-paypal-order',
  //                 { headers: { Authorization: `Bearer ${token}` } }
  //               );
  //               const orderData = response.data;
  
  //               if (orderData.id) {
  //                 setPaypalOrderId(orderData.id); // Set PayPal order ID
  //                 setPaymentLoading(false); // Stop loading once PayPal order ID is retrieved
  //                 return orderData.id; // Return the PayPal order ID
  //               } else {
  //                 throw new Error('Order ID not found in server response');
  //               }           
  //             }}
  //             onApprove={async (data) => {
  //               setPaymentLoading(true); // Start loading during approval
  //               const token = localStorage.getItem('token');
  //               const response = await axios.post(
  //                 '/api/orders/confirm-paypal',
  //                 {                  
  //                   paypalOrderId: data.orderID, 
  //                   address_id: deliveryDetails.address_id, 
  //                   currency: 'USD'
  //                 },
  //                 { headers: { Authorization: `Bearer ${token}` } }
  //               );
  //               const orderData = response.data; // Access the parsed data directly
  //               setPaymentSuccess(true);
  //               setPaymentLoading(false); // Stop loading after payment confirmation
  //               console.log("PayPal transaction completed", orderData);
  //             }}
  //           />
  //         </PayPalScriptProvider>
  //       )}
  //     </div>
  //   )
  //   ;
  // };

  const renderPaymentStep = () => (
    <div>
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
            "currency": "GBP",
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
                  currency: 'GBP'
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
      <ul>
        {cartItems.map((item) => (
          <li key={item.cart_item_id}>
            {item.name} - {item.quantity} x ${item?.price?.toFixed(2)}
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
    
    <div className="h-max w-full">
                <div 
        className={`${backdropPosition} z-10 inset-0 bg-black opacity-50 w-full`}
        onClick={() => setBackdropPosition('hidden')}
      />
          {( backdropPosition == 'fixed' ? (
        <NewAddress 
          className={`z-[100] mx-auto`}
          onAddressAdded={handleAddressAdded} // Pass the callback to hide form on successful submission
        />

      ) : null
        

      )}
     <nav
        className={`navbar md:px-[40px] px-[20px] w-full h-[80px] flex items-center justify-between top-0 left-0 relative bg-white`}
      >


        <section className="section_middle absolute left-1/2 hover:cursor-pointer transform -translate-x-1/2 flex items-center text-[20px] sm:text-[40px]"
          onClick={() => navigate('/')}
        >

          <h1 className="m-0">RIMAS</h1>
          <img
            className="sm:h-[60px] h-[30px] md:mx-2 mx-[2px]"
            src="/images/diamond.png"
            alt="Diamond Logo"
          />
          <h1 className="m-0">STORE</h1>
        </section>


      </nav>
    <div className="cart container mx-auto my-8 p-4 flex flex-col md:flex-row w-[95%] md:w-[80%] gap-2">
    <div className="container  p-4 text-left">
    {paymentSuccess ? (
      <div className="text-left">
        <h2 className="text-3xl font-bold mb-4 w-[60%]">Order Confirmed</h2>
        <p>Thank you for your purchase! A confirmation email will be sent shortly.</p>
        <Link to={'/products/search'}>
        <button
                className="block px-4 py-2 bg-blue-500 text-white font-medium mt-4 hover:bg-blue-600 w-full"              >
                Continue Shopping
              </button>
        </Link>
      </div>
    ) : (
      <div>
        <div className={`mb-4 ${currentStep >= 1 ? 'opacity-100' : 'opacity-50'}`}>
        <h2 className="text-2xl font-bold mb-4">1. Select Delivery Address</h2>
        <div className="ml-7">
          {renderDeliveryStep()}
        </div>
        </div>
        <div className="h-[1px] w-full bg-gray-300 mb-2"/>
        <div className={`mb-4 ${currentStep >= 2 ? 'opacity-100' : 'opacity-50'}`}>
        <h2 className="text-2xl font-bold mb-4">2. Select Payment Method</h2>
        <div className="ml-7">
          {currentStep >= 2 && renderPaymentSelectionStep()}
        </div>
        </div>
        <div className="h-[1px] w-full bg-gray-200 mb-2"/>
        <div className={`mb-4 ${currentStep >= 3 ? 'opacity-100' : 'opacity-50'}`}>
        <h2 className="text-2xl font-bold mb-4">3. Payment Information</h2>
        <div className="ml-7">
          {currentStep >= 3 && renderPaymentStep()}
        </div>
        </div>
        <div className="h-[1px] w-full bg-gray-300 mb-2"/>
        {/* <div className={`mb-4 ${currentStep >= 4 ? 'opacity-100' : 'opacity-50'}`}>
        <h2 className="text-2xl font-bold mb-4">4. Review and Confirm</h2>
        <div className="ml-7">
          {currentStep >= 4 && renderReviewStep()}
        </div>
        </div>
        <div className="h-[1px] w-full bg-gray-300 mb-2"/> */}

      </div>
    )}
  </div>
  <div className="flex justify-start flex-col font-bold md:w-[40%]">
  {/* <div className="grid grid-cols-1 md:grid-cols-1 gap-5 w-[60%]"> */}
      <span className="text-[20px] text-left mb-2">
              Order Summary
            </span>
            <div className="">
  {cartItems.map((item) => (
    <div key={item.cart_item_id} className="flex flex-row gap-2 border px-4 py-1 h-[50px] items-center justify-between">
  <div className="flex gap-5 items-center">
    <div className="h-[40px] w-[40px]">
    <img
      src={item.image_url}
      alt={item.name}
      className="object-cover w-full rounded h-[100%]"
    />
    </div>
    <div className="flex flex-col flex-grow text-left">
      <h2 className="text-sm font-bold truncate max-w-[150px]">{trimString(item.name)}</h2>
    </div>
  </div>
  <div className="flex items-center text-right my-2 text-sm">
    <label
      htmlFor={`quantity-${item.cart_item_id}`}
      className="mr-2"
    >
      x{item.quantity}
    </label>
  </div>
</div>
  ))}
</div>

      <div className="h-[1px] w-full bg-gray-300 mb-1"/>
         <div className="justify-between font-normal w-full flex my-0">
            <span className="text-[15px]">
              Items:
            </span>
            <span className="text-[15px]">£{itemsAmount}</span>

          </div>
          <div className="justify-between font-normal w-full flex mb-1">
            <span className="text-[15px]">
              Postage & Packing:
            </span>
            <span className="text-[15px]">£{deliveryAmount}</span>

          </div>
        <div className="h-[1px] w-full bg-gray-300 mb-1"/>

          <div className="justify-between w-full flex my-1">
            <span className="text-[20px]">
              Total
              {/* <span className="text-[15px]"> (Exluding Delivery)</span> */}
            </span>
            <span className="text-[20px]">£{totalAmount?.toFixed(2)}</span>

          </div>
          <div className="h-[1px] w-full bg-gray-300 mb-2"/>
          <AcceptedPaymentMethods />

        </div>
  </div>
    </div>
  // </div>
  );
};

export default CheckoutPage;
