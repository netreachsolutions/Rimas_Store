// models/orderModel.js

const { queryDatabase } = require('../config/pool');


const createOrder = (orderData, callback) => {
  const { customer_id, delivery_amount, total_weight } = orderData;
  // Log the values to verify they're correct
  console.log('customer_id:', customer_id);
  console.log('deliveryAmount:', delivery_amount);
  console.log('totalWeight:', total_weight);
  const query = 'INSERT INTO orders (customer_id, delivery_amount, total_weight) VALUES (?, ?, ?)';
  // return db.query(query, [customer_id, delivery_amount]);
  queryDatabase(query, [customer_id, delivery_amount, total_weight], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
};

const createOrderItem = (orderItemData, callback) => {
  const { order_id, product_id, quantity, price } = orderItemData;
  const query = 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)';
  // return db.query(query, [order_id, product_id, quantity, price]);
  queryDatabase(query, [order_id, product_id, quantity, price], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
};

const createDelivery = (deliveryData, callback) => {
  const { order_id, address_id } = deliveryData;
  const query = 'INSERT INTO deliveries (order_id, address_id, delivery_status) VALUES (?, ?, "processing")';
  // return db.query(query, [order_id, address_id]);
  queryDatabase(query, [order_id, address_id], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
};

const findOrdersByCustomerId = (customerId, callback) => {
  const query = 'SELECT * FROM orders WHERE customer_id = ?';
  // return db.query(query, [customerId]);
  queryDatabase(query, [customerId], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
};

const selectAllOrders = (callback) => {
  const query = `
SELECT 
  orders.order_id AS orderID,
  orders.created_at AS orderDateTime,
  CONCAT(customers.name) AS customerName,
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
  // return db.query(query, callback);
  queryDatabase(query, [], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });

};

const updateDeliveryStatus = (order_id, delivery_status, tracking_id, courier, callback) => {
  // const {delivery_status, tracking_id, courier} = delivery;
  console.log(`${delivery_status} : ${tracking_id} : ${courier}`)
  const query = 'UPDATE deliveries SET delivery_status = ?, tracking_id = ?, courier = ? WHERE order_id = ?';
  // db.query(query, [delivery_status, order_id], callback);
  queryDatabase(query, [delivery_status, tracking_id, courier, order_id], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
};

const getOrderCustomer = (orderId, callback) => {
  const query = 'SELECT * FROM customers WHERE customer_id = (SELECT customer_id from orders WHERE order_id = ?)'
  // db.query(query, [orderId], callback)
  queryDatabase(query, [orderId], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
}

const getCustomerOrders = (customerId, callback) => {
  const query = `
    SELECT 
      o.order_id, 
      o.customer_id, 
      o.delivery_amount, 
      o.created_at,
      oi.order_item_id, 
      oi.product_id, 
      oi.quantity, 
      oi.price AS item_price,
      p.name AS product_name,
      pi.image_url
    FROM orders o
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.product_id
    LEFT JOIN 
    product_image pi ON oi.product_id = pi.product_id 
    WHERE o.customer_id = ?
  `;
  
  queryDatabase(query, [customerId], (err, results) => {
    if (err) return callback(err, null);

    // Process the result to group order items by orders
    const ordersMap = {};

    results.forEach(row => {
      if (!ordersMap[row.order_id]) {
        ordersMap[row.order_id] = {
          order_id: row.order_id,
          customer_id: row.customer_id,
          delivery_amount: row.delivery_amount,
          created_at: row.created_at,
          items: []
        };
      }

      ordersMap[row.order_id].items.push({
        order_item_id: row.order_item_id,
        product_id: row.product_id,
        product_name: row.product_name,
        quantity: row.quantity,
        price: row.item_price,
        image_url: row.image_url
      });
    });

    // Convert the orders map to an array
    const orders = Object.values(ordersMap);
    callback(null, orders);
  });
};


const selectOrderDetails = (orderId, callback) => {
  const query = `
  SELECT o.order_id, o.created_at, o.delivery_amount AS total, o.customer_id, o.total_weight,
        c.name, c.email, c.phone_number,
        d.address_id, a.first_line, a.city, a.postcode, a.country, d.delivery_status, d.courier, d.tracking_id,
        p.payment_id, p.processor_id, p.amount AS payment_amount, p.currency
  FROM orders o
  LEFT JOIN customers c ON o.customer_id = c.customer_id
  LEFT JOIN deliveries d ON o.order_id = d.order_id
  LEFT JOIN addresses a ON d.address_id = a.address_id
  LEFT JOIN payments p ON o.order_id = p.order_id
  WHERE o.order_id = ?;
  `;
  // db.query(query, [orderId], callback);
  queryDatabase(query, [orderId], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
};

const selectOrderItems = (orderId, callback) => {
  const query = `
    SELECT 
      order_items.*, 
      products.name, 
      products.product_weight,
      product_image.image_url 
    FROM 
      order_items
    JOIN 
      orders ON order_items.order_id = orders.order_id
    JOIN 
      products ON order_items.product_id = products.product_id
    LEFT JOIN 
      product_image ON products.product_id = product_image.product_id 
    WHERE 
      order_items.order_id = ?
    GROUP BY 
      order_items.order_item_id, product_image.product_id
    ORDER BY 
      product_image.priority DESC;
  `;
  // db.query(query, [orderId], callback);
  queryDatabase(query, [orderId], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
};

module.exports = {
  createOrder,
  createOrderItem,
  createDelivery,
  findOrdersByCustomerId,
  selectAllOrders,
  updateDeliveryStatus,
  selectOrderDetails,
  getOrderCustomer,
  selectOrderItems,
  getCustomerOrders
};
