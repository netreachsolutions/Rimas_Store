import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Spinner from "./Spinner";
import { MdDeleteForever } from "react-icons/md";
import { useAlert } from '../context/AlertContext'; // import the useAlert hook
import { FaSearch } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import AcceptedPaymentMethods from "./AcceptedPaymentMethods";




const Cart = () => {
  const {showAlert} = useAlert();
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(null);
  const [itemsAmount, setItemsAmount] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deliveryAmount, setDeliveryAmount] = useState(null);
  const { quantity, fetchCartItems, cartProducts, cart } = useCart();


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatedQuantities, setUpdatedQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    try {
      fetchCartItems();
      
    } catch (error) {
      showAlert('Error Fetching Cart Items', 'danger')
    }
    console.log(cart)
  }, []);

  
  // const fetchCartItems = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const cartResponse = await axios.get("/api/carts", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setCartItems(cartResponse.data.cartItems);
  //     setTotalAmount(cartResponse.data.price.total);
  //     setDeliveryAmount(cartResponse.data.price.delivery);
  //     setItemsAmount(cartResponse.data.price.items);
  //     setLoading(false);
  //   } catch (error) {
  //     setError("Error fetching cart items");
  //     setLoading(false);
  //   }
  // };

  function trimString(str) {
    const maxChars = 25;
    return str.length > maxChars ? str.substring(0, maxChars) + ".." : str;
}
  
  const handleQuantityChange = (item, newQuantity) => {
    console.log(item)
    let value = newQuantity
    if (newQuantity > 0 && newQuantity <= item.stock) {
      handleUpdateCart(item.cart_item_id, newQuantity) 
    } else if (newQuantity > item.stock) {
      showAlert('No More Available Stock', 'warning')
    } else {
      
    }
    console.log(cartItems)  
  //   setUpdatedQuantities((prevQuantities) => ({
  //     ...prevQuantities,
  //     [cartItemId]: newQuantity,
  //   }));
  };

  const handleUpdateCart = async (cartItemId, quantity) => {
    // alert(quantity)
    // alert(cartItemId)
    try {
      setIsUpdating(true)
      const token = localStorage.getItem("token");
      // const quantity = updatedQuantities[cartItemId];
      await axios.put(
        "/api/carts/update",
        { cartItemId, quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchCartItems();
      setIsUpdating(false)
      // setCartItems((prevItems) =>
      //   prevItems.map((item) =>
      //     item.cart_item_id === cartItemId ? { ...item, quantity } : item
      //   )
      // );
    } catch (error) {
      console.log(error)
      setError("Error updating cart item");
    } finally {
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/carts/remove",
        { cartItemId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // setCartItems((prevItems) =>
      //   prevItems.filter((item) => item.cart_item_id !== cartItemId)
      // );
      fetchCartItems();
      showAlert('Item Succesfully Removed From Cart', 'success')
    } catch (error) {
      console.log(error)
      setError("Error removing cart item");
    }
  };

  if (loading) {
    return (<div>      <NavBar /><Spinner/></div>);
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (cart.cartItems?.length === 0) {
    return (
    <>
      <NavBar/>
      <div className="w-full">
        <h1 className="text-[30px] font-normal">
          Your cart is empty
          </h1>
        <button 
          className=" mx-auto md:bottom-[20vh] animate-pulse md:static z-10 flex gap-4 shadow-xl text-[30px] md:text-[50px] bg-white text-black items-center rounded-[50px] px-8 py-4 transition-transform duration-500 ease-in-out hover:scale-[120%]"
          onClick={() => navigate('/products/search')}
        >
          <FaSearch/> Shop
        </button>
      </div>;
    
    </>
    )
  }

  const handleProceedToCheckout = () => {
    navigate("/checkout", { state: { cartItems } });
  };

  return (
    <>
      <NavBar />
        <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      <div className="cart container mx-auto my-8 md:p-4 flex flex-col md:flex-row w-[80%] gap-10">
        <div className="flex justify-start flex-col font-bold md:hidden md:w-[40%]">
        <div className="h-[1px] w-full bg-gray-300 mb-1"/>

          <div className="justify-between w-full flex my-1">
            <span className="text-[20px]">
              Total
              <span className="text-[15px]"> (Exluding Delivery)</span>
            </span>
            <span className="text-[20px]">£{cart.price.items.toFixed(2)}</span>

          </div>
          <div className="h-[1px] w-full bg-gray-300 mb-2"/>
          <button
            onClick={handleProceedToCheckout}
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-700 transition duration-300 w-full"
          >
            Proceed to Checkout
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-5 md:w-[60%]">
          {cart.cartItems.map((item) => (
            <div key={item.cart_item_id} className="flex flex-col md:flex-row gap-2 border p-4  md:h-[130px] justify-between">

              <div className="flex  md:flex-row gap-5">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="object-cover h-[125px] md:h-auto  md:w-[100px] rounded"
                />
                <div className="flex flex-col text-left w-[180px] mr-[20px]">
                  <h2 className="text-xl font-bold">{trimString(item.name)}</h2>
                  <p className="text-lg">Price: ${item.price}</p>
                  <button
                onClick={() => handleRemoveItem(item.cart_item_id)}
                className="bg-transparent text-[14px] text-gray-500 underline rounded hover:text-black transition duration-300 h-min w-min"
              >
               Remove
              </button>

                </div>
              </div>
              <div className="flex items-center my-2 md:w-[200px] justify-between">

               <div className={`leading-none border-2 border-gray flex items-center text-[35px] h-[55px] md:text-[40px] font-light ${isUpdating ? 'bg-gray-50 text-gray-400' : ''}`}>
                <button className='w-full h-full text-[45px] md:text-[50px] hover:bg-gray-100 px-2' 
                  onClick={() => handleQuantityChange(item, item.quantity-1)}
                  disabled={isUpdating}
                >-</button>
                <h2 className='md:text-[25px] text-[23px] text-center w-max mx-[5px] flex justify-center translate-x-[1px] translate-y-[2px]'>{updatedQuantities[item.cart_item_id] || item.quantity}</h2>
                <button className='hover:bg-gray-100 px-2 h-full' 
                  onClick={() => handleQuantityChange(item, item.quantity+1)}
                  disabled={isUpdating}
                >+</button>
              </div>
              <h1 className="text-[22px]">£{item.total.toFixed(2)}</h1>

              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-start flex-col font-bold md:w-[40%] px-3 rounded ">
        <div className="h-[1px] w-full bg-gray-300 mb-1"/>

          <div className="justify-between w-full flex my-1">
            <span className="text-[20px]">
              Total
              <span className="text-[15px]"> (Exluding Delivery)</span>
            </span>
            <span className="text-[20px]">£{cart.price.items.toFixed(2)}</span>

          </div>
          <div className="h-[1px] w-full bg-gray-300 mb-2"/>
          <div className="h-5"/>
          <AcceptedPaymentMethods/>
          <button
            onClick={handleProceedToCheckout}
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-700 transition duration-300 w-full"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
};


export default Cart;
