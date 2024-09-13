import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from '../api/axios'; // Adjust the import based on your project structure
import AdminSideBar from './AdminSideBar';
import { IoArrowBackOutline } from "react-icons/io5";
import AdminSideBarMobile from './AdminSideBarMobile';


const OrderDetails = () => {
  const { id } = useParams();
  console.log(id);
  const [orderItems, setOrderItems] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/orders/${id}/details`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response.data);
        setOrderDetails(response.data.orderDetails);
        setLoading(false);
      } catch (error) {
        setError('Error fetching order details');
        setLoading(false);
      }
    };

    const fetchOrderItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/orders/${id}/items`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response.data);
        setOrderItems(response.data.orderItems);
        setLoading(false);
      } catch (error) {
        setError('Error fetching order details');
        setLoading(false);
      }
    }

    fetchOrderDetails();
    fetchOrderItems();
  }, []);
  

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }

  if (!orderDetails) {
    return <div className="text-gray-500 text-center mt-8">No order details found</div>;
  }

  return (
    <div className="flex">
      <AdminSideBarMobile />
      <div className="container mx-auto my-8 p-6 flex-grow bg-white shadow-md rounded-lg text-left md:ml-64">
        <div className='inner-container max-w-[900px] m-auto'>
        <Link to={'/orders'}>
        <span className='flex gap-1 items-center rounded-xl py-1 px-1.5 bg-gray-50 w-max  text-gray-500'>
        <IoArrowBackOutline />

        Back to Orders
        </span>
        </Link>
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Order Details for Order #{orderDetails.order_id}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className='bg-gray-100 rounded px-4 py-2'>
        <h3 className="text-xl font-semibold mb-2 text-gray-700 ">Customer Details</h3>
            <p className="mb-2"><strong className="text-gray-600">Name:</strong> {orderDetails.first_name} {orderDetails.last_name}</p>
            <p className="mb-2"><strong className="text-gray-600">Email:</strong> {orderDetails.email}</p>
            <p className="mb-2"><strong className="text-gray-600">Phone:</strong> {orderDetails.phone_number}</p>
          </div>

          <div className='bg-gray-100 rounded px-4 py-2'>
                        <h3 className="text-xl font-semibold mb-2 text-gray-700">Delivery Details</h3>
            <p className="mb-2"><strong className="text-gray-600">Address:</strong> {orderDetails.first_line}, {orderDetails.city}, {orderDetails.postcode}, {orderDetails.country}</p>
            <p className="mb-2"><strong className="text-gray-600">Delivery Status:</strong> {orderDetails.delivery_status}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className='bg-gray-100 rounded px-4 py-2'>
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Payment Details</h3>
            <p className="mb-2"><strong className="text-gray-600">Payment ID:</strong> {orderDetails.payment_id}</p>
            <p className="mb-2"><strong className="text-gray-600">Processor ID:</strong> {orderDetails.processor_id}</p>
            <p className="mb-2"><strong className="text-gray-600">Amount:</strong> ${orderDetails.payment_amount}</p>
            <p className="mb-2"><strong className="text-gray-600">Currency:</strong> {orderDetails.currency}</p>
          </div>

          <div className='bg-gray-100 rounded px-4 py-2'>
            <h3 className="text-xl font-semibold mb-2 text-gray-700">Order Summary</h3>
            <p className="mb-2"><strong className="text-gray-600">Order Date:</strong> {new Date(orderDetails.created_at).toLocaleDateString()}</p>
            <p className="mb-2"><strong className="text-gray-600">Total:</strong> ${orderDetails.total}</p>
          </div>
        </div>
    <div className="grid grid-cols-1 md:grid-cols-1 gap-5 w-full max-w-[500px]">
      <h1 className='font-bold'>Items</h1>
          {orderItems.map((item) => (
                <div key={item.order_item_id} className="flex flex-row gap-2 border px-4 py-1 h-[90px] items-center justify-between">
                <div className="flex gap-5 items-center">
                  <div className="h-[80px] w-[70px]">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="object-cover w-full rounded h-[100%]"
                  />
                  </div>
                  <div className="flex flex-col flex-grow text-left">
                    <h2 className="text-sm font-normal "><b>{item.name}</b> #{item.product_id}</h2>
                  </div>
                </div>
                <div className="flex items-center text-right my-2 text-sm">
                  <label
                    htmlFor={`quantity-${item.cart_item_id}`}
                    className="mr-2"
                  >
                    x{item.quantity}
                  </label>
                </div>
              </div>
          ))}
        </div>
      </div>
    </div>
        </div>
  );
};

export default OrderDetails;
