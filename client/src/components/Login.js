// src/components/Login.js
import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAlert } from '../context/AlertContext'; // import the useAlert hook
import { PiCircleNotch } from "react-icons/pi";



const Login = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const {showAlert} = useAlert();
  const [formData, setFormData] = 
  useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const response = await axios.post(`api/users/login`, formData);
      // alert(response.data.accessToken);
      localStorage.setItem('token', response.data.accessToken);
      showAlert('Login Success!', 'success');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Error logging in:', error);
      showAlert('Login failed. Please try again.', 'danger');
      // alert('Login failed. Please try again.');
    }
    setIsProcessing(false);
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
      {/* <h2 className="text-2xl font-bold mb-4">Login</h2> */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
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
          className="w-full py-2 px-4 font-semibold text-white bg-black rounded-md hover:bg-gray-700 disabled:bg-gray-700"
          disabled={isProcessing}
        >
          {isProcessing ? (<PiCircleNotch className='animate-spin text-[30px] m-auto'/>) : (<span>Login</span>)}
          
        </button>
      </form>
      <Link to='/register' className='mt-5'>
      <span className='mt-5 underline'>Register</span>
      </Link>
      <Link to='/reset' className='mt-5'>
      <span className='mt-5 underline'>Forgot Password</span>
      </Link>
    </div>
  );
};

export default Login;
