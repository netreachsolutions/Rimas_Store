import React, { useState, useEffect } from 'react';
import axios from '../api/axios'; // Adjust the import based on your project structure
import { Link } from 'react-router-dom';
import AdminSideBar from './AdminSideBar';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrders, setExpandedOrders] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusInput, setStatusInput] = useState('');
  const [trackingIdInput, setTrackingIdInput] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data.orders);
        setLoading(false);
      } catch (error) {
        setError('Error fetching orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleExpandOrder = (orderId) => {
    setExpandedOrders((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId],
    }));
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setStatusInput(order.deliveryStatus);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/orders/${selectedOrder.orderID}/status`, {
        delivery_status: statusInput,
        tracking_id: trackingIdInput
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update the order status locally
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderID === selectedOrder.orderID
            ? { ...order, deliveryStatus: statusInput }
            : order
        )
      );
      closeModal();
    } catch (error) {
      setError('Error updating delivery status');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='flex'>
    <AdminSideBar/>
    <div className="container mx-auto my-8 p-4 flex-grow ml-64">
      <h2 className="text-2xl font-bold mb-4">All Orders</h2>
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Order ID</th>
            <th className="border px-4 py-2">Order Date/Time</th>
            <th className="border px-4 py-2">Customer Name</th>
            <th className="border px-4 py-2">Total Amount</th>
            <th className="border px-4 py-2">Delivery Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <React.Fragment key={order.orderID}>
              <tr>
                <td className="border px-4 py-2 text-center">{order.orderID}</td>
                <td className="border px-4 py-2 text-center">{order.orderDateTime}</td>
                <td className="border px-4 py-2 text-center">{order.customerName}</td>
                <td className="border px-4 py-2 text-center">${order.totalAmount}</td>
                <td className="border px-4 py-2 text-center">{order.deliveryStatus}</td>
                <td className="border px-4 py-2 text-center">
                  <Link to={`/order/${order.orderID}`}>
                    <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2">
                      View Details
                      </button>
                  </Link>
                  {/* <button
                    className="bg-blue text-white px-4 py-2 rounded hover:bg-blue mr-2"
                    onClick={() => toggleExpandOrder(order.orderID)}
                  >
                    {expandedOrders[order.orderID] ? 'Hide Details' : 'View Details'}
                  </button> */}
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={() => openModal(order)}
                  >
                    Update Status
                  </button>
                </td>
              </tr>
              {expandedOrders[order.orderID] && (
                <tr>
                  <td colSpan="6" className="border px-4 py-2 bg-gray">
                    <h3 className="text-lg font-bold mb-2">Order Details</h3>
                    <p><strong>Customer Email:</strong> {order.customerEmail}</p>
                    <p><strong>Customer Address:</strong> {order.customerAddress}</p>
                    <h4 className="font-semibold mt-4">Order Items:</h4>
                    <ul>
                      {order.items.map(item => (
                        <li key={item.productID} className="mb-2">
                          {item.quantity} x {item.productName} @ ${item.price}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
            <h3 className="text-xl font-bold mb-4">Update Order Status</h3>
            <form onSubmit={handleModalSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Order Status</label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                >
                  <option value="processing">Processing</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="arrived">Delivered</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Tracking ID</label>
                <input
                  type="text"
                  value={trackingIdInput}
                  onChange={(e) => setTrackingIdInput(e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                  placeholder="Enter tracking ID"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Orders;
