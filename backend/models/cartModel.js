// models/cartModel.js

const { queryDatabase } = require('../config/pool');

const createCart = (customerId, callback) => {
  const query = 'INSERT INTO carts (customer_id) VALUES (?)';
  // db.query(query, [customerId], callback);
  queryDatabase(query, [customerId], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
};

const findCartByCustomerId = (customerId, callback) => {
  const query = 'SELECT * FROM carts WHERE customer_id = ?';
  // db.query(query, [customerId], callback);
  queryDatabase(query, [customerId], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
};


const createCartItem = (cartItemData, callback) => {
  const { cart_id, product_id, quantity, price } = cartItemData;
  const query = 'INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES (?, ?, ?, ?)';
  queryDatabase(query, [cart_id, product_id, quantity, price], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
};

const findCartItemsByCartId = (cartId, callback) => {
  const query = `
    SELECT 
      cart_items.*, 
      products.name, 
      product_image.image_url, 
      products.product_id,
      products.product_weight,
      products.stock
    FROM 
      cart_items 
    JOIN 
      products ON cart_items.product_id = products.product_id 
    LEFT JOIN 
      product_image ON cart_items.product_id = product_image.product_id 
    WHERE 
      cart_items.cart_id = ?
    GROUP BY 
      cart_items.cart_item_id, product_image.product_id
    ORDER BY 
      product_image.priority DESC
  `;
  // db.query(query, [cartId], callback);
  queryDatabase(query, [cartId], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
};


const updateCartItemById = (cartItemId, quantity, callback) => {
  const query = 'UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?';
  // db.query(query, [quantity, cartItemId], callback);
  queryDatabase(query, [quantity, cartItemId], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
};

const deleteCartItemById = (cartItemId, callback) => {
  const query = 'DELETE FROM cart_items WHERE cart_item_id = ?';
  // db.query(query, [cartItemId], callback);
  queryDatabase(query, [cartItemId], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
};

const clearCartItems = (customerId, callback) => {
  const query = 'DELETE FROM carts WHERE customer_id = ?';
  // db.query(query, [customerID], callback);
  queryDatabase(query, [customerId], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
}

module.exports = {
  createCart,
  findCartByCustomerId,
  createCartItem,
  findCartItemsByCartId,
  updateCartItemById,
  deleteCartItemById,
  clearCartItems
};

  