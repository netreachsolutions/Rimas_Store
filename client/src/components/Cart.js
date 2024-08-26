import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatedQuantities, setUpdatedQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/carts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(response.data.cartItems);
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
    } catch (error) {
      setError("Error removing cart item");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (cartItems.length === 0) {
    return <div>Your cart is empty</div>;
  }

  const handleProceedToCheckout = () => {
    navigate("/checkout", { state: { cartItems } });
  };

  return (
    <>
      <NavBar />
      <div className="cart container mx-auto my-8 p-4">
        <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cartItems.map((item) => (
            <div key={item.cart_item_id} className="flex flex-col border p-4">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-auto mb-4"
              />
              <h2 className="text-xl font-bold">{item.name}</h2>
              <p className="text-lg">Price: ${item.price}</p>
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
              </div>
              <button
                onClick={() => handleRemoveItem(item.cart_item_id)}
                className="bg-red-500 text-white px-3 py-2 mt-4 rounded hover:bg-red-700 transition duration-300"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-8">
          <button
            onClick={handleProceedToCheckout}
            className="bg-blue text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;
