// models/orderModel.js

const createOrder = (db, orderData) => {
  const { customer_id, delivery_amount } = orderData;
  const query = 'INSERT INTO orders (customer_id, delivery_amount, created_at) VALUES (?, ?, NOW())';
  return db.query(query, [customer_id, delivery_amount]);
};

const createOrderItem = (db, orderItemData) => {
  const { order_id, product_id, quantity, price } = orderItemData;
  const query = 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)';
  return db.query(query, [order_id, product_id, quantity, price]);
};

const createDelivery = (db, deliveryData) => {
  const { order_id, address_id } = deliveryData;
  const query = 'INSERT INTO deliveries (order_id, address_id, delivery_status) VALUES (?, ?, "processing")';
  return db.query(query, [order_id, address_id]);
};

const findOrdersByCustomerId = (db, customerId) => {
  const query = 'SELECT * FROM orders WHERE customer_id = ?';
  return db.query(query, [customerId]);
};

const selectAllOrders = (db, callback) => {
  const query = `
SELECT 
  orders.order_id AS orderID,
  orders.created_at AS orderDateTime,
  CONCAT(customers.first_name, ' ', customers.last_name) AS customerName,
  TRIM(TRAILING '.00' FROM FORMAT(SUM(order_items.quantity * order_items.price) + orders.delivery_amount/100, 2)) AS totalAmount,
  deliveries.delivery_status AS deliveryStatus
FROM 
  orders
JOIN customers ON orders.customer_id = customers.customer_id
LEFT JOIN order_items ON orders.order_id = order_items.order_id
LEFT JOIN payments ON orders.order_id = payments.order_id
LEFT JOIN deliveries ON orders.order_id = deliveries.order_id
GROUP BY 
  orders.order_id, orders.created_at, customerName, deliveries.delivery_status
ORDER BY 
  orders.created_at DESC;
  `;
  return db.query(query, callback);
};

const updateDeliveryStatus = (db, order_id, delivery_status, callback) => {
  const query = 'UPDATE deliveries SET delivery_status = ? WHERE order_id = ?';
  db.query(query, [delivery_status, order_id], callback);
};

const selectOrderDetails = (db, orderId, callback) => {
  const query = `
  SELECT o.order_id, o.created_at, o.delivery_amount AS total, o.customer_id,
        c.first_name, c.last_name, c.email, c.phone_number,
        d.address_id, a.first_line, a.city, a.postcode, a.country, d.delivery_status,
        p.payment_id, p.processor_id, p.amount AS payment_amount, p.currency
  FROM orders o
  LEFT JOIN customers c ON o.customer_id = c.customer_id
  LEFT JOIN deliveries d ON o.order_id = d.order_id
  LEFT JOIN addresses a ON d.address_id = a.address_id
  LEFT JOIN payments p ON o.order_id = p.order_id
  WHERE o.order_id = 7;
  `;
  db.query(query, [orderId], callback);
};

module.exports = {
  createOrder,
  createOrderItem,
  createDelivery,
  findOrdersByCustomerId,
  selectAllOrders,
  updateDeliveryStatus,
  selectOrderDetails,
};
