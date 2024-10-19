import React, { useState } from 'react';
import axios from '../api/axios';
import { useAlert } from '../context/AlertContext';
import { useLogin } from '../context/LoginContext'; // Import the context
import { PiCircleNotch } from "react-icons/pi";

const LoginForm = ({ onClose, onSuccess }) => {
  const { showRegister, showReset } = useLogin(); // Add showReset function from context
  const [isProcessing, setIsProcessing] = useState(false);
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const response = await axios.post(`api/users/login`, formData);
      localStorage.setItem('token', response.data.accessToken);
      showAlert('Login Success!', 'success');
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      showAlert('Invalid Username or Password', 'danger');
      console.error('Error logging in:', error);
    }
    setIsProcessing(false);
  };

  return (
    <>
      <div className="fixed top-0 z-50 inset-0 bg-black opacity-50 w-full h-screen" onClick={onClose} />
      <div className="left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 max-w-md mx-auto z-50 fixed flex flex-col bg-white p-6 items-center justify-center rounded-2xl shadow-xl w-[90%] max-w-[500px]">
        <section className="mx-auto flex justify-center items-center text-[30px] mb-4">
          <h1 className="m-0">Login</h1>
        </section>
        <form onSubmit={handleSubmit} className="space-y-3 w-full">
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
          <button type="submit" className="w-full py-2 px-4 font-semibold text-white bg-black rounded-md hover:bg-gray-700" disabled={isProcessing}>
            {isProcessing ? <PiCircleNotch className="animate-spin text-[30px] m-auto" /> : <span>Login</span>}
          </button>
        </form>

        {/* Register Link */}
        <button
          className="mt-5 underline"
          onClick={() => showRegister()} // Call the showRegister function from context
        >
          Register
        </button>

        {/* Reset Password Link */}
        <button
          className="mt-5 underline"
          onClick={() => showReset()} // Call the showReset function from context
        >
          Forgot Password
        </button>
      </div>
    </>
  );
};

export default LoginForm;
