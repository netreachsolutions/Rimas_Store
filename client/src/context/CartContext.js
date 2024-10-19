import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios';

// Create the CartContext
const CartContext = createContext();

// Custom hook to use the CartContext
export const useCart = () => useContext(CartContext);

// CartProvider component that wraps the application
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({cartItems:[]})
  const [cartProducts, setCartProducts] = useState([]);
  const [quantity, setQuantity] = useState(0);

  // Function to fetch cart items
  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('/api/carts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const items = response.data.cartItems;
        setCart(response.data);
        setCartProducts(items);

        // Calculate the total quantity of items in the cart
        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
        setQuantity(totalQuantity);
        // alert(tot)
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setCartProducts([]);
      setQuantity(0);
    }
  };

  // Function to add an item to the cart
  const addItemToCart = async (productId, quantityToAdd) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(
          '/api/carts/add',
          { productId, quantity: quantityToAdd },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Refetch cart items after adding an item
        fetchCartItems();
      } else {
        console.error('User is not logged in');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  // Fetch cart items when the component mounts (after login)
  useEffect(() => {
    fetchCartItems();
  }, []);

  // Context value to be passed to children
  const contextValue = {
    items: cartProducts,
    cart: cart,
    quantity,
    fetchCartItems,
    addItemToCart,
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};
