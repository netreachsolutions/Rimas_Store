import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Spinner from "./Spinner";
import { MdDeleteForever } from "react-icons/md";
import { useAlert } from '../context/AlertContext'; // import the useAlert hook
import { FaSearch } from "react-icons/fa";




const Cart = () => {
  const showAlert = useAlert();
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(null);
  const [itemsAmount, setItemsAmount] = useState(null);
  const [deliveryAmount, setDeliveryAmount] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatedQuantities, setUpdatedQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const cartResponse = await axios.get("/api/carts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(cartResponse.data.cartItems);
        setTotalAmount(cartResponse.data.price.total);
        setDeliveryAmount(cartResponse.data.price.delivery);
        setItemsAmount(cartResponse.data.price.items);
        setLoading(false);
      } catch (error) {
        setError("Error fetching cart items");
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleQuantityChange = (cartItemId, newQuantity) => {
    setUpdatedQuantities((prevQuantities) => ({
      ...prevQuantities,
      [cartItemId]: newQuantity,
    }));
  };

  const handleUpdateCart = async (cartItemId) => {
    try {
      const token = localStorage.getItem("token");
      const quantity = updatedQuantities[cartItemId];
      await axios.put(
        "/api/carts/update",
        { cartItemId, quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.cart_item_id === cartItemId ? { ...item, quantity } : item
        )
      );
      setUpdatedQuantities((prev) => {
        const updated = { ...prev };
        delete updated[cartItemId];
        return updated;
      });
    } catch (error) {
      setError("Error updating cart item");
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
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.cart_item_id !== cartItemId)
      );
      showAlert('Item Succesfully Removed From Cart')
    } catch (error) {
      setError("Error removing cart item");
    }
  };

  if (loading) {
    return (<div>      <NavBar /><Spinner/></div>);
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (cartItems.length === 0) {
    return (
    <>
      <NavBar/>
      <div>
        <h1 className="text-[30px] font-normal">
          Your cart is empty
          </h1>
        <button 
          className="absolute m-auto bottom-[20vh] animate-pulse md:static z-10 flex gap-4 shadow-xl text-[30px] md:text-[50px] bg-white text-black items-center rounded-[50px] px-8 py-4 transition-transform duration-500 ease-in-out hover:scale-[120%]"
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
      <div className="cart container mx-auto my-8 md:p-4 flex flex-col md:flex-row w-[80%] gap-2">
        <div className="flex justify-start flex-col font-bold md:hidden md:w-[40%]">
        <div className="h-[1px] w-full bg-gray-300 mb-1"/>

          <div className="justify-between w-full flex my-1">
            <span className="text-[20px]">
              Total
              <span className="text-[15px]"> (Exluding Delivery)</span>
            </span>
            <span className="text-[20px]">£{itemsAmount}</span>

          </div>
          <div className="h-[1px] w-full bg-gray-300 mb-2"/>
          <button
            onClick={handleProceedToCheckout}
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-700 transition duration-300 w-full"
          >
            Proceed to Checkout
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-5 w-[60%]">
          {cartItems.map((item) => (
            <div key={item.cart_item_id} className="flex flex-col md:flex-row gap-2 border p-4  md:h-[130px] justify-between">
              <div className="flex gap-5">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="object-cover  md:w-[100px] rounded"
                />
                <div className="flex flex-col text-left">
                  <h2 className="text-xl font-bold">{item.name}</h2>
                  <p className="text-lg">Price: ${item.price}</p>

                </div>
              </div>
              <div className="flex items-center my-2">
                <label
                  htmlFor={`quantity-${item.cart_item_id}`}
                  className="mr-2"
                >
                  Quantity:
                </label>
                <input
                  type="number"
                  id={`quantity-${item.cart_item_id}`}
                  value={updatedQuantities[item.cart_item_id] || item.quantity}
                  min="1"
                  max="99"
                  onChange={(e) =>
                    handleQuantityChange(
                      item.cart_item_id,
                      parseInt(e.target.value, 10)
                    )
                  }
                  className="border px-2 py-1 w-16"
                />
                <button
                  onClick={() => handleUpdateCart(item.cart_item_id)}
                  className="ml-4 bg-black text-white px-3 py-2 rounded hover:bg-red transition duration-300"
                >
                  Update
                </button>
              <button
                onClick={() => handleRemoveItem(item.cart_item_id)}
                className="bg-transparent text-red-500 px-1 py-1 translate-y-2 mt-4 rounded hover:bg-gray-200 transition duration-300 h-min w-min"
              >
                <MdDeleteForever className='text-[35px] text-red'/>
              </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-start flex-col font-bold md:w-[40%]">
        <div className="h-[1px] w-full bg-gray-300 mb-1"/>

          <div className="justify-between w-full flex my-1">
            <span className="text-[20px]">
              Total
              <span className="text-[15px]"> (Exluding Delivery)</span>
            </span>
            <span className="text-[20px]">£{itemsAmount}</span>

          </div>
          <div className="h-[1px] w-full bg-gray-300 mb-2"/>
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
