// services/notificationService.js
const {sendEmail, sendSMS} = require('../config/emailConfig');
const customerService = require('./customerService');
const OrderService = require('./orderService');

class NotificationService {

  static async sendOrderProcessingNotification(db, orderId) {
    try {
      // Fetch customer details
      const customer = await OrderService.getCustomerDetails(db, orderId);
      const order = await OrderService.getOrderDetails(db, orderId)

      // Email message for the customer
      const customerEmailMsg = {
        to: customer.email,
        subject: 'RIMAS Order Confirmation',
        text: `Thank you for your order! Your order number is #${orderId}. The total amount is ${order.payment_amount}.`,
        html: `
          <h1>Order Confirmation</h1>
          <p>Thank you for your purchase, ${customer.first_name}!</p>
          <p>Your order number is #${order.order_id}.</p>
          <p>Total amount: ${order.payment_amount}.</p>
          <p>We'll notify you once your order has been shipped.</p>
          <br>
          <p>Rimas Store Limited</p>
        `,
      };
      await sendEmail(customerEmailMsg);

      // Send SMS to the customer if phone number exists
      if (customer.phone_number) {
        const smsText = `Order Confirmed! \nOrder #${orderId} \nTotal: ${order.payment_amount} \nRimas Store Ltd.`;
        await sendSMS(smsText, customer.phone_number);
      }

      const merchantEmailMsg = {
        to: process.env.MERCHANT_EMAIL,
        subject: `New Order #${order.order_id} Received`,
        text: `A new order #${order.order_id} has been placed with a total amount of ${order.payment_amount}.`,
        html: `
          <h1>New Order Received</h1>
          <p>A new order has been placed.</p>
          <p>Order ID: ${order.order_id}</p>
          <p>Total amount: ${order.payment_amount}</p>
          <p>https://rimastores.com/order/${order.order_id}</p>
          <br>
          <p>Rimas Store Admin</p>
        `,
      };
      await sendEmail(merchantEmailMsg);

      const merchantSmsText = `New Order Received \nA new order has been placed.\nOrder ID: ${order.order_id} \nTotal amount: ${order.payment_amount}\n https://rimastores.com/order/${order.order_id}`;
      await sendSMS(merchantSmsText, process.env.MERCHANT_NUMBER);

      return { success: true };
    } catch (error) {
      console.error('Error sending order processing notification:', error);
      throw new Error('Failed to send order processing notification');
    }
  }

  static async sendOrderDispatchedNotification(db, orderId) {
    try {
      // Fetch customer details
      const customer = await OrderService.getCustomerDetails(db, orderId);
      const order = await OrderService.getOrderDetails(db, orderId)

      // Email message for the customer
      const customerEmailMsg = {
        to: customer.email,
        subject: 'RIMAS Order Dispatched',
        text: `Good news! Your order #${order.order_id} has been dispatched and is on its way to you.`,
        html: `
          <h1>Order Dispatched</h1>
          <p>Dear ${customer.first_name},</p>
          <p>Your order #${order.order_id} has been dispatched.</p>
          <p>We hope you enjoy your purchase!</p>
          <br>
          <p>Rimas Store Limited</p>
        `,
      };
      await sendEmail(customerEmailMsg);

      // Send SMS to the customer if phone number exists
      if (customer.phone_number) {
        const smsText = `Order Dispatched! \nYour order #${orderId} has been shipped. \nRimas Store Ltd.`;
        await sendSMS(smsText, customer.phone_number);
      }

      // Notify the merchant
      const merchantEmailMsg = {
        to: process.env.MERCHANT_EMAIL,
        subject: `Order #${order.order_id} Dispatched`,
        text: `Order #${order.order_id} has been marked as dispatched.`,
        html: `
          <h1>Order Dispatched</h1>
          <p>Order ID: ${order.order_id} has been dispatched to the customer.</p>
          <br>
          <p>Rimas Store Admin</p>
        `,
      };
      await sendEmail(merchantEmailMsg);


      return { success: true };
    } catch (error) {
      console.error('Error sending order dispatched notification:', error);
      throw new Error('Failed to send order dispatched notification');
    }
  }
}

module.exports = NotificationService;
