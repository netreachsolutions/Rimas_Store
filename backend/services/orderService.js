const { reject } = require('bcrypt/promises');
const {
    createOrder,
    createOrderItem,
    createDelivery, 
    selectAllOrders,
    updateDeliveryStatus,
    selectOrderDetails,
    getOrderCustomer,
    selectOrderItems,
    getCustomerOrders
} = require('../models/orderModel');

class OrderService {
    // static async createOrder(customerId, addressId, cartItems, totalAmount, shippingCost) {
    //     return new Promise((resolve, reject) => {
    //         try {
    //             // Step 1: Create the order
    //             // const [orderResult] = await createOrder({
    //             //     customer_id: customerId,
    //             //     delivery_amount: shippingCost
    //             // });
    //             createOrder({
    //                 customer_id: customerId,
    //                 delivery_amount: shippingCost
    //             }, (err, result) => {
    //                 if (err) return reject('order creation error: '+err);
    //                 const [orderResult] = result; 
    //             });

    //             const orderId = orderResult.insertId;

    //             // Step 2: Create order items
    //             for (const item of cartItems) {

    //                 // await createOrderItem({
    //                 //     order_id: orderId,
    //                 //     product_id: item.product_id,
    //                 //     quantity: item.quantity,
    //                 //     price: item.price
    //                 // });
    //                 createOrderItem({
    //                     order_id: orderId,
    //                     product_id: item.product_id,
    //                     quantity: item.quantity,
    //                     price: item.price
    //                 }, (err, result) => {
    //                     if (err) return reject('order item creation error: '+err);
    //                 });
    //             }


    //             // Step 3: Create delivery record
    //             // await createDelivery({
    //             //     order_id: orderId,
    //             //     address_id: addressId
    //             // });
    //             createDelivery({
    //                 order_id: orderId,
    //                 address_id: addressId
    //             }, (err, result) => {
    //                 if (err) return reject('delivery creation error: '+err);
    //             });

    //             // If everything is successful, resolve with the order ID
    //             resolve(orderId);
    //         } catch (err) {
    //             reject(err); // Handle error
    //         }
    //     });
    // }

    static createOrder(customerId, addressId, cartItems, totalAmount, shippingCost, totalWeight) {
        return new Promise((resolve, reject) => {
            // Step 1: Create the order
            createOrder({ customer_id: customerId, delivery_amount: shippingCost, total_weight: totalWeight }, (err, orderResult) => {
                if (err) {
                    return reject('Order creation error: ' + err);
                }

                const orderId = orderResult.insertId;

                // Step 2: Create order items in parallel
                let itemsProcessed = 0;
                for (const item of cartItems) {
                    createOrderItem({
                        order_id: orderId,
                        product_id: item.product_id,
                        quantity: item.quantity,
                        price: item.price
                    }, (err) => {
                        if (err) {
                            return reject('Order item creation error: ' + err);
                        }

                        itemsProcessed++;
                        if (itemsProcessed === cartItems.length) {
                            // Step 3: Create delivery record once all items are processed
                            createDelivery({ order_id: orderId, address_id: addressId }, (err) => {
                                if (err) {
                                    return reject('Delivery creation error: ' + err);
                                }

                                // If everything is successful, resolve with the order ID
                                resolve(orderId);
                            });
                        }
                    });
                }
            });
        });
    }


    static async getAllOrders(db) {
        return new Promise((resolve, reject) => {
            console.log('attemting orders retrieval')
        selectAllOrders((err, result) => {
            if (err) {
                console.error('Error retrieving orders:', err);
                return reject(err); // Reject if there's an error creating the product image
              }
              console.log('result')
            resolve(result);
        })
        });
    }

    static async updateDeliveryStatus(order_id, delivery_status, tracking_id, courier) {
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
            updateDeliveryStatus(order_id, delivery_status, tracking_id, courier, (err, result) => {
                if (err) {
                    console.error('Error updating delivery status:', err);
                    return reject(err); // Reject the promise on error
                }                                                               
                
                console.log('Delivery status updated successfully');
                resolve(result); // Resolve the promise with the result
            });
        });
    }

    static async getOrderDetails(orderId) {
        return new Promise((resolve, reject) => {
          selectOrderDetails(orderId, (err, result) => {
            if (err) {
              console.error('Error fetching order details:', err);
              return reject(err);
            }
            resolve(result[0]);
          });
        });
      }

      static async getOrderItems(orderId) {
        return new Promise((resolve, reject) => {
          selectOrderItems(orderId, (err, result) => {
            if (err) {
              console.error('Error fetching order details:', err);
              return reject(err);
            }
            resolve(result);
          });
        });
      }

    static async getCustomerDetails(orderId) {
    return new Promise((resolve, reject) => {
        getOrderCustomer(orderId, (err, result) => {
        if (err) {
            console.error('Error fetching customer details:', err);
            return reject(err);
        }
        resolve(result[0]);
        });
    });
    }

    static async getCustomerOrders(customerId) {
        return new Promise((resolve, reject) => {
            getCustomerOrders(customerId, (err, orders) => {
            if (err) {
                console.error('Error fetching orders:', err);
                return reject(err);
            };
            resolve(orders);

            })
        })
    }



}

module.exports = OrderService;
