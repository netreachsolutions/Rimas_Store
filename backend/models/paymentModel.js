// models/paymentModel.js

const createPayment = (db, paymentData, callback) => {
    const { order_id, processor_id, amount, currency, paymentStatus } = paymentData;
    const query = 'INSERT INTO payments (order_id, processor_id, amount, currency, payment_status) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [order_id, processor_id, amount, currency, paymentStatus], callback);
  };
  
  module.exports = {
    createPayment,
  };
  