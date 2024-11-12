const cartService = require('../services/cartService');
const db = require('../config/db');
const CartService = require('../services/cartService');

exports.addToCart = async (req, res) => {
  try {
    const customerId = req.tokenAssets.customerId;
    const { productId, quantity, price } = req.body;
    await cartService.addToCart(customerId, productId, quantity, price);
    res.status(201).json({ message: 'Item added to cart successfully' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    // If error message indicates stock issue, return 400 Bad Request
    if (error === 'Not Enough In Stock') {
      return res.status(400).json({ message: 'Requested quantity exceeds available stock' });
    }    
    res.status(500).json({ message: 'Failed to add item to cart' });
  }
};

exports.viewCart = async (req, res) => {
  try {
    const customerId = req.tokenAssets.customerId;
    const cartItems = await cartService.viewCart(customerId);
    const price = cartService.calculatePrice(cartItems);
    res.json({ cartItems, price });
  } catch (error) {
    console.error('Error viewing cart:', error);
    res.status(500).json({ message: 'Failed to retrieve cart' });
  }
};

exports.updateCartItem = async (req, res) => {
    console.log('update cartt???')
  try {
    const { cartItemId, quantity } = req.body;
    await cartService.updateCartItem(cartItemId, quantity);
    res.json({ message: 'Cart item updated successfully' });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Failed to update cart item' });
  }
};

exports.removeCartItem = async (req, res) => {
  console.log('attemting cart removal')
  try {
    const { cartItemId } = req.body;
    await cartService.removeCartItem(cartItemId);
    res.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ message: 'Failed to remove cart item' });
  }
};
