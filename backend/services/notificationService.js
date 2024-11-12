// services/notificationService.js
const {sendEmail, sendSMS} = require('../config/emailConfig');
const CartService = require('./cartService');
const CustomerService = require('./customerService');
const OrderService = require('./orderService');

class NotificationService {

  static async sendOTP(method, contact, otp) {

    console.log(`Contact:${contact}`)
    try {

      if (method == 'email') {
        console.log(contact);
        const customerEmailMsg = {
          to: contact,
          subject: 'RIMAS Password Reset',
          text: `Your one time code is ${otp}.`,
          html: `
            <h1>Password Reset</h1>
            <p>You're one time code is: <b>${otp}</b></p>
            <p>It will expire in 2 minutes</p>d
            <br>
            <p>Rimas Store Limited</p>
          `,
        };
        await sendEmail(customerEmailMsg);

      } else if (method == 'phone') {
      // Email message for the customer
        const smsText = `You're one time code is: \n ${otp} \nRimas Store Ltd.`;
        await sendSMS(smsText, contact);

      }
    } catch (error) {
      console.error('Error sending order processing notification:', error);
      throw new Error('Failed to send order processing notification');
    }


  }

  static async sendOrderProcessingNotification(orderId) {
    try {
      // Fetch customer details
      const customer = await OrderService.getCustomerDetails(orderId);
      const order = await OrderService.getOrderDetails(orderId)
      const amount = order.payment_amount/100;

      if (customer.email) {
        // Email message for the customer
        const customerEmailMsg = {
          to: customer.email,
          subject: 'RIMAS Order Confirmation',
          text: `Thank you for your order! Your order number is #${orderId}. The total amount is £${amount}.`,
          html: `
            <h1>Order Confirmation</h1>
            <p>Thank you for your purchase, ${customer.name}!</p>
            <p>Your order number is #${order.order_id}.</p>
            <p>Total amount: £${amount}.</p>
            <p>We'll notify you once your order has been shipped.</p>
            <br>
            <p>Rimas Store Limited</p>
          `,
        };
        await sendEmail(customerEmailMsg);
      }

      // Send SMS to the customer if phone number exists
      if (customer.phone_number) {
        const smsText = `Order Confirmed! \nOrder #${orderId} \nTotal: £${amount} \nRimas Store Ltd.`;
        await sendSMS(smsText, customer.phone_number);
      }

      const merchantEmailMsg = {
        to: process.env.MERCHANT_EMAIL,
        subject: `New Order #${order.order_id} Received`,
        text: `A new order #${order.order_id} has been placed with a total amount of £${amount}.`,
        html: `
          <h1>New Order Received</h1>
          <p>A new order has been placed.</p>
          <p>Order ID: ${order.order_id}</p>
          <p>Total amount: £${amount}</p>
          <p>https://rimastores.com/order/${order.order_id}</p>
          <br>
          <p>Rimas Store Admin</p>
        `,
      };
      await sendEmail(merchantEmailMsg);

      const merchantSmsText = `New Order Received \nA new order has been placed.\nOrder ID: ${order.order_id} \nTotal amount: £${order.payment_amount}\n https://rimastores.com/order/${order.order_id}`;
      // await sendSMS(merchantSmsText, process.env.MERCHANT_NUMBER);

      return { success: true };
    } catch (error) {
      console.error('Error sending order processing notification:', error);
      throw new Error('Failed to send order processing notification');
    }
  }

  static async sendOrderDispatchedNotification(orderId) {
    try {
      // Fetch customer details
      const customer = await OrderService.getCustomerDetails(orderId);
      const order = await OrderService.getOrderDetails(orderId)


      // Email message for the customer
      const customerEmailMsg = {
        to: customer.email,
        subject: 'RIMAS Order Dispatched',
        text: `Good news! Your order #${order.order_id} has been dispatched and is on its way to you.`,
        html: `
          <h1>Order Dispatched</h1>
          <p>Dear ${customer.name},</p>
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

  static async sendCustomOrderRequestNotification(customerID, address_id, message) {
    try {
      // Fetch customer details
      const customer = await CustomerService.getCustomerProfile(customerID);
      const cart_items = await CartService.viewCart(customerID);
  
      // Format cart items into HTML table
      let cartItemsHtml = `
        <table border="1" cellpadding="5" cellspacing="0">
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
      `;
  
      cart_items.forEach(item => {
        cartItemsHtml += `
          <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>£${item.price}</td>
          </tr>
        `;
      });
  
      cartItemsHtml += '</table>';
  
      // Email message for the merchant
      const merchantEmailMsg = {
        to: process.env.MERCHANT_EMAIL, // Ensure this environment variable is set
        subject: `Custom Order Request from Customer #${customerID}`,
        text: `Customer ${customer.name} (${customer.email}) has requested a custom order.`,
        html: `
          <h1>Custom Order Request</h1>
          <p><strong>Customer Name:</strong> ${customer.name}</p>
          <p><strong>Email:</strong> ${customer.email}</p>
          <p><strong>Phone:</strong> ${customer.phone_number || 'N/A'}</p>
          <p><strong>Address ID:</strong> ${address_id || 'N/A'}</p>
          <p><strong>Message:</strong></p>
          <p>${message || 'No additional message provided.'}</p>
          <h2>Cart Items:</h2>
          ${cartItemsHtml}
          <br>
          <p>Rimas Store System</p>
        `,
      };
      await sendEmail(merchantEmailMsg);
  
      // Optionally, send a confirmation email to the customer
      const customerEmailMsg = {
        to: customer.email,
        subject: 'RIMAS Custom Order Request Received',
        text: `Dear ${customer.name},\n\nWe have received your custom order request. Our team will contact you shortly.\n\nRimas Store Limited`,
        html: `
          <h1>Custom Order Request Received</h1>
          <p>Dear ${customer.name},</p>
          <p>We have received your custom order request. Our team will contact you shortly.</p>
          <br>
          <p>Rimas Store Limited</p>
        `,
      };
      await sendEmail(customerEmailMsg);
  
      // Send SMS to the merchant if you have their phone number
      // if (process.env.MERCHANT_PHONE_NUMBER) {
      //   const smsText = `Custom Order Request from ${customer.name}. Check your email for details.`;
      //   await sendSMS(smsText, process.env.MERCHANT_PHONE_NUMBER);
      // }
  
      return { success: true };
    } catch (error) {
      console.error('Error sending custom order request notification:', error);
      throw new Error('Failed to send custom order request notification');
    }
  }
  
}


module.exports = NotificationService;
