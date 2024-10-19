// src/components/Login.js
import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useHistory } from '../context/HistoryContext';

const AdminLogin = (state) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const {prevLocation} = useHistory();
  const location = useLocation();
  // const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentTimestamp = new Date().toISOString();
      setFormData({ ...formData, timestamp: currentTimestamp});
      const response = await axios.post(`api/admin/login`, formData);
      // alert(response.data.accessToken);
      localStorage.setItem('token', response.data.accessToken);
      navigate(prevLocation, { replace: true });
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 flex items-center flex-col justify-center h-screen">
                    <section className="section_middle mx-auto mb-6 flex justify-center items-center text-[40px]">
          <h1 className="m-0">RIMAS</h1>
          <img
            className="h-[60px]   mx-[2px]"
            src="/images/diamond.png"
            alt="Diamond Logo"
          />
          <h1 className="m-0">STORE</h1>
        </section>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="username"
          placeholder="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full py-2 px-4 font-semibold text-white bg-black rounded-md hover:bg-gray-700"
        >
          Login as Merchant
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
