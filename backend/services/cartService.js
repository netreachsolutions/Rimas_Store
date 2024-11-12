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
    static async addToCart(customerId, productId, quantity, price) {
      return new Promise((resolve, reject) => {
        // Step 1: Check if the customer has a cart
        findCartByCustomerId(customerId, async (err, cartResult) => {
          if (err) return reject(err);
  
          let cartId;
  
          // Step 2: If no cart exists, create a new one
          if (cartResult.length === 0) {
            createCart(customerId, (err, cartResult) => {
              if (err) return reject(err);
              cartId = cartResult.insertId;
  
              // Step 3: Add item to the new cart
              createCartItem({ cart_id: cartId, product_id: productId, quantity, price }, (err, cartItemResult) => {
                if (err) return reject(err);
                resolve(cartItemResult);
              });
            });
          } else {
            // Step 4: Add item to the existing cart
            const cartItems = await this.viewCart(customerId);
            let containsProduct = false; 
            // Step 5: Check if product already in cart and handle stock
            cartItems.forEach(async item => {
              if (item.product_id == productId) {
                containsProduct = true
                // update the existing cart item with the sum of the quantities (if there is enough stock)
                const newQuantity = quantity + item.quantity;
                if (newQuantity > item.stock) {
                  return reject('Not Enough In Stock')
                } 
                const result = await this.updateCartItem(item.cart_item_id, newQuantity);
                return resolve(result);
              }
            })
            cartId = cartResult[0].cart_id;
            if (!containsProduct) {
              createCartItem({ cart_id: cartId, product_id: productId, quantity, price }, (err, cartItemResult) => {
                if (err) return reject(err);
                resolve(cartItemResult);
              });

            }
          }
        });
      });
    }
  
    static async viewCart(customerId) {
      return new Promise((resolve, reject) => {
        // Step 1: Find the cart for the customer
        findCartByCustomerId(customerId, (err, cartResult) => {
          if (err) return reject(err);
          if (cartResult.length === 0) return resolve([]); // Empty cart
  
          const cartId = cartResult[0].cart_id;
  
          // Step 2: Find the items in the cart
          findCartItemsByCartId(cartId, (err, cartItems) => {
            if (err) return reject(err);
            cartItems.forEach((item, index) => {
              cartItems[index] = {...item, total: item.quantity * item.price}
            })
            resolve(cartItems);
            
          });
        });
      });
    }

    // static calcultatePrice(cartItems) {
    //     let itemsAmount = 0;
    //     cartItems.forEach(item => {
    //       itemsAmount += item.price * item.quantity; // Assuming each item has price and quantity fields
    //     });
    //     const deliveryAmount = 2.99;
    //     return {total: itemsAmount+deliveryAmount, items: itemsAmount, delivery: deliveryAmount};
    // }

    static calculatePrice(cartItems) { 
      try {
        // const cartItems = await CartService.viewCart(customerId);
        // Calculate the total amount
        let itemsAmount = 0;
        let netWeight = 0;
        cartItems.forEach(item => {
          itemsAmount += item.price * item.quantity; // Assuming each item has price and quantity fields
          netWeight += item.product_weight * item.quantity;
          console.log(item.product_weight)
        });
  
        // let shippingCost =0;
        // console.log(cartItems.length)
        // console.log(netWeight)
        // if (netWeight < 2000) {
        //   shippingCost = 1.99;
        // } else {
        //   shippingCost = 4.99;
        // }
        let shippingCost =20;
        if (netWeight < 2000) {
          shippingCost = 5;
        } else if (netWeight < 4000) {
          shippingCost = 10;
        }
        
  
        return {total: itemsAmount+shippingCost, items: itemsAmount, delivery: shippingCost};
  
        return totalAmount;
      } catch (error) {
        console.error('Error creating payment intent:', error);
        throw new Error(error.message);
      }
    }


    static async viewCartById(cartId) {
      return new Promise((resolve, reject) => {
  
          // Find the items in the cart
          findCartItemsByCartId(cartId, (err, cartItems) => {
            if (err) return reject(err);
            resolve(cartItems);
          });

      });
    }

    static async clearCart(customerId) {
      return new Promise((resolve, reject) => {
        // Remove the item from the cart
        clearCartItems(customerId, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });

      //   createCart(customerId, (err, cartResult) => {
      //     if (err) return reject(err);
      //     cartId = cartResult.insertId;
      // });
      resolve();
    })
  }


  
    static async updateCartItem(cartItemId, quantity) {
      return new Promise((resolve, reject) => {
        // Update the quantity of the item in the cart
        updateCartItemById(cartItemId, quantity, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });
    }
  
    static async removeCartItem(cartItemId) {
      return new Promise((resolve, reject) => {
        // Remove the item from the cart
        deleteCartItemById(cartItemId, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });
    }
  }
  
  module.exports = CartService;
  