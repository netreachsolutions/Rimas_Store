import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import axios from '../api/axios';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);  // State to store customer orders
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');  // Get token from localStorage
        if (!token) {
          setError('User is not authenticated');
          setLoading(false);
          return;
        }

        // Fetch orders for the logged-in customer with authorization header
        const response = await axios.post('/api/orders/myorders', {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        setOrders(response.data);  // Set orders in state
        setLoading(false);  // Disable loading when data is fetched
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders.');
        setLoading(false);  // Disable loading if an error occurs
      }
    };

    fetchOrders();
  }, []);  // Empty dependency array ensures the effect runs once when the component is mounted

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div ><NavBar/><h2 className="text-center text-red-500 py-4">{error}</h2></div>;
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">My Orders</h1>

        {orders.length === 0 ? (
          <p className="text-center text-gray-600">No orders found.</p>
        ) : (
          <div className="space-y-6">
            {orders?.map(order => (
              <div key={order.order_id} className="border p-4 rounded-lg shadow-lg bg-white">
                <h2 className="text-lg font-semibold mb-2">Order #{order.order_id}</h2>
                <p className="text-sm">Order Date: {new Date(order.created_at).toLocaleDateString()}</p>
                <p className="text-sm">Delivery Amount: £{order?.delivery_amount}</p>
                <p className="text-sm">Status: <span className="font-bold">{order.status || 'Pending'}</span></p>

                <div className="mt-4">
                  <h3 className="font-bold">Items:</h3>
                  <ul className="space-y-2">
                    {order.items?.map(item => (
                      <li key={item.order_item_id} className="flex flex-row gap-4 border px-4 py-2 h-[90px] items-center justify-between">
                        <div className="flex gap-4 items-center">
                          <div className="h-[80px] w-[70px]">
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="object-cover w-full rounded h-[100%]"
                            />
                          </div>
                          <div className="flex flex-col flex-grow text-left">
                            <h2 className="text-sm font-bold">{item.product_name}</h2>
                            <p className="text-xs text-gray-600">Product ID: {item.product_id}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end text-right">
                          <p className="text-sm">x{item.quantity}</p>
                          <p className="text-sm font-semibold">£{parseFloat(item?.price).toFixed(2)}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyOrders;
