// models/deliveryModel.js

const createDelivery = (db, deliveryData, callback) => {
    const { order_id, address_id, delivery_status } = deliveryData;
    const query = 'INSERT INTO deliveries (order_id, address_id, delivery_status) VALUES (?, ?, ?)';
    db.query(query, [order_id, address_id, delivery_status], callback);
  };
  
  module.exports = {
    createDelivery,
  };
  