const {
    createOrder,
    createOrderItem,
    createDelivery, 
    selectAllOrders,
    updateDeliveryStatus,
    selectOrderDetails,
} = require('../models/orderModel');

class OrderService {
    static createOrder(db, customerId, addressId, cartItems, totalAmount, shippingCost) {
        return new Promise(async (resolve, reject) => {
            try {
                // Step 1: Create the order
                const [orderResult] = await createOrder(db, {
                    customer_id: customerId,
                    delivery_amount: shippingCost
                });

                const orderId = orderResult.insertId;

                // Step 2: Create order items
                for (const item of cartItems) {
                    await createOrderItem(db, {
                        order_id: orderId,
                        product_id: item.product_id,
                        quantity: item.quantity,
                        price: item.price
                    });
                }

                // Step 3: Create delivery record
                await createDelivery(db, {
                    order_id: orderId,
                    address_id: addressId
                });

                // If everything is successful, resolve with the order ID
                resolve(orderId);
            } catch (err) {
                reject(err); // Handle error
            }
        });
    }


    static async getAllOrders(db) {
        return new Promise((resolve, reject) => {
            console.log('attemting orders retrieval')
        selectAllOrders(db, (err, result) => {
            if (err) {
                console.error('Error retrieving orders:', err);
                return reject(err); // Reject if there's an error creating the product image
              }
              console.log('result')
            resolve(result);
        })
        });
    }

    static async updateDeliveryStatus(db, order_id, delivery_status) {
        return new Promise((resolve, reject) => {
            console.log('Attempting to update delivery status');
            console.log("Delivery Status: "+delivery_status);
            // Validate the delivery status
            const validStatuses = ['processing', 'dispatched', 'arrived'];
            if (!validStatuses.includes(delivery_status)) {
                console.error('Invalid delivery status');
                return reject(new Error('Invalid delivery status'));
            }

            // Call the model function to update the delivery status
            updateDeliveryStatus(db, order_id, delivery_status, (err, result) => {
                if (err) {
                    console.error('Error updating delivery status:', err);
                    return reject(err); // Reject the promise on error
                }
                
                console.log('Delivery status updated successfully');
                resolve(result); // Resolve the promise with the result
            });
        });
    }

    static async getOrderDetails(db, orderId) {
        return new Promise((resolve, reject) => {
          selectOrderDetails(db, orderId, (err, result) => {
            if (err) {
              console.error('Error fetching order details:', err);
              return reject(err);
            }
            resolve(result[0]);
          });
        });
      }



}

module.exports = OrderService;
