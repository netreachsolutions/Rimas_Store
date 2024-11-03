import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAlert } from '../context/AlertContext';
import { useLogin } from '../context/LoginContext'; // Import the context
import { PiCircleNotch } from "react-icons/pi";

const LoginForm = ({ onClose, onSuccess }) => {
  const { showRegister, showReset } = useLogin(); // Add showReset function from context
  const [isProcessing, setIsProcessing] = useState(false);
  const { showAlert } = useAlert();
  const [selectedOption, setSelectedOption] = useState("signin"); // Default to "signin"
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

  useEffect(() => {
    if (selectedOption == "register") {
      showRegister()
    }
  }, [selectedOption])

  return (
    <>
      <div className="fixed top-0 z-50 inset-0 bg-black opacity-50 w-full h-screen" onClick={onClose} />
      <div className="left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 max-w-md mx-auto z-50 fixed flex flex-col bg-white p-6 items-center justify-center rounded-2xl shadow-xl w-[90%] max-w-[500px]">
        <section className="mx-auto flex justify-center items-center text-[30px] mb-4">
          {/* <h1 className="m-0">Login</h1> */}
        </section>

        <div className="mb-4 flex flex-col justify-left items-start w-full border-[1px] rounded-[5px]">
          <label className="block px-2 py-1 bg-gray-50 w-full text-left">
            <input
              type="radio"
              name="paymentMethod"
              value="register"
              checked={selectedOption === "register"}
              onChange={() => setSelectedOption("register")}
            />
            <span className="ml-1 text-[15px]">Register</span> <span className="text-[12px] text-gray-700">Create an account.</span>
          </label>
          <div className="w-full h-[0.5px] bg-gray-200" />
          <label className="block mx-2 my-1">
            <input
              type="radio"
              name="paymentMethod"
              value="signin"
              checked={selectedOption === "signin"}
              onChange={() => setSelectedOption("signin")}
            />
            <span className="ml-1 text-[15px]">Sign in</span> <span className="text-[12px] text-gray-700">Already a Customer?</span>
          </label>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 w-full">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded shadow-md"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded shadow-md"
            required
          />
          <button type="submit" className="w-full py-2 px-4 font-semibold text-white bg-black rounded-md hover:bg-gray-700 shadow-sm" disabled={isProcessing}>
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
