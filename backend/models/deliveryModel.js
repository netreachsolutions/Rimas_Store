// models/deliveryModel.js

const { queryDatabase } = require('../config/pool');


const createDelivery = (deliveryData, callback) => {
    const { order_id, address_id, delivery_status } = deliveryData;
    const query = 'INSERT INTO deliveries (order_id, address_id, delivery_status) VALUES (?, ?, ?)';
    // db.query(query, [order_id, address_id, delivery_status], callback);
    queryDatabase(query, [order_id, address_id, delivery_status], (err, results) => {
      if (err) return callback(err, null);  // Pass error to callback
      callback(null, results);              // Pass results to callback
    });
  };
  
  module.exports = {
    createDelivery,
  };
  