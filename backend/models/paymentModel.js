// models/paymentModel.js

const createPayment = (db, paymentData, callback) => {
    const { order_id, processor_id, amount, currency } = paymentData;
    const query = 'INSERT INTO payments (order_id, processor_id, amount, currency) VALUES (?, ?, ?, ?)';
    db.query(query, [order_id, processor_id, amount, currency], callback);
  };
  
  module.exports = {
    createPayment,
  };
  