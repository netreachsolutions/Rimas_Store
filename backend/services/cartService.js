const {
    createCart,
    findCartByCustomerId,
    createCartItem,
    findCartItemsByCartId,
    updateCartItemById,
    deleteCartItemById,
    clearCartItems,
  } = require('../models/cartModel');
  
  class CartService {
    static async addToCart(db, customerId, productId, quantity, price) {
      return new Promise((resolve, reject) => {
        // Step 1: Check if the customer has a cart
        findCartByCustomerId(db, customerId, (err, cartResult) => {
          if (err) return reject(err);
  
          let cartId;
  
          // Step 2: If no cart exists, create a new one
          if (cartResult.length === 0) {
            createCart(db, customerId, (err, cartResult) => {
              if (err) return reject(err);
              cartId = cartResult.insertId;
  
              // Step 3: Add item to the new cart
              createCartItem(db, { cart_id: cartId, product_id: productId, quantity, price }, (err, cartItemResult) => {
                if (err) return reject(err);
                resolve(cartItemResult);
              });
            });
          } else {
            // Step 4: Add item to the existing cart
            cartId = cartResult[0].cart_id;
            createCartItem(db, { cart_id: cartId, product_id: productId, quantity, price }, (err, cartItemResult) => {
              if (err) return reject(err);
              resolve(cartItemResult);
            });
          }
        });
      });
    }
  
    static async viewCart(db, customerId) {
      return new Promise((resolve, reject) => {
        // Step 1: Find the cart for the customer
        findCartByCustomerId(db, customerId, (err, cartResult) => {
          if (err) return reject(err);
          if (cartResult.length === 0) return resolve([]); // Empty cart
  
          const cartId = cartResult[0].cart_id;
  
          // Step 2: Find the items in the cart
          findCartItemsByCartId(db, cartId, (err, cartItems) => {
            if (err) return reject(err);
            resolve(cartItems);
          });
        });
      });
    }

    static async viewCartById(db, cartId) {
      return new Promise((resolve, reject) => {
  
          // Find the items in the cart
          findCartItemsByCartId(db, cartId, (err, cartItems) => {
            if (err) return reject(err);
            resolve(cartItems);
          });

      });
    }

    static async clearCart(db, customerId) {
      return new Promise((resolve, reject) => {
        // Remove the item from the cart
        clearCartItems(db, customerId, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });

      //   createCart(db, customerId, (err, cartResult) => {
      //     if (err) return reject(err);
      //     cartId = cartResult.insertId;
      // });
      resolve();
    })
  }


  
    static async updateCartItem(db, cartItemId, quantity) {
      return new Promise((resolve, reject) => {
        // Update the quantity of the item in the cart
        updateCartItemById(db, cartItemId, quantity, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });
    }
  
    static async removeCartItem(db, cartItemId) {
      return new Promise((resolve, reject) => {
        // Remove the item from the cart
        deleteCartItemById(db, cartItemId, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });
    }
  }
  
  module.exports = CartService;
  