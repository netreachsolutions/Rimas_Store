// models/cartModel.js

const createCart = (db, customerId, callback) => {
  const query = 'INSERT INTO carts (customer_id) VALUES (?)';
  db.query(query, [customerId], callback);
};

const findCartByCustomerId = (db, customerId, callback) => {
  const query = 'SELECT * FROM carts WHERE customer_id = ?';
  db.query(query, [customerId], callback);
};


const createCartItem = (db, cartItemData, callback) => {
  const { cart_id, product_id, quantity, price } = cartItemData;
  const query = 'INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES (?, ?, ?, ?)';
  db.query(query, [cart_id, product_id, quantity, price], callback);
};

const findCartItemsByCartId = (db, cartId, callback) => {
  const query = `
    SELECT cart_items.*, products.name 
    FROM cart_items 
    JOIN products ON cart_items.product_id = products.product_id 
    WHERE cart_id = ?`;
  db.query(query, [cartId], callback);
};

const updateCartItemById = (db, cartItemId, quantity, callback) => {
  const query = 'UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?';
  db.query(query, [quantity, cartItemId], callback);
};

const deleteCartItemById = (db, cartItemId, callback) => {
  const query = 'DELETE FROM cart_items WHERE cart_item_id = ?';
  db.query(query, [cartItemId], callback);
};

const clearCartItems = (db, customerID, callback) => {
  const query = 'DELETE FROM carts WHERE customer_id = ?';
  db.query(query, [customerID], callback);
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

  