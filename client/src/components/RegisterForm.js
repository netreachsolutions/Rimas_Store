import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAlert } from '../context/AlertContext'; // Importing the useAlert hook
import { useLogin } from '../context/LoginContext'; // Import the context
import { PiCircleNotch } from "react-icons/pi";

const RegisterForm = ({ onClose, onSuccess }) => {
  const { showLogin } = useLogin(); // Access showLogin function from context
  const { showAlert } = useAlert(); // Using the alert context
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedOption, setSelectedOption] = useState("register"); // Default to "register"
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    phone: '',
  });
  const [conf_password, setConfPassword] = useState('');
  const countryCodes = ['+44', '+1', '+91', '+61', '+49']; // Add more as needed


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true); // Start the processing state

    // Validation Checks
    if (formData.password !== conf_password) {
      showAlert('Passwords do not match. Please try again.', 'warning');
      setIsProcessing(false);
      return; // Stop form submission
    }

    if (formData.password.length < 6) {
      showAlert('Password must be at least 6 characters long.', 'warning');
      setIsProcessing(false);
      return; // Stop form submission
    }

    try {
      const response = await axios.post(`api/users/register`, formData);
      showAlert('Registration Successful!', 'success'); // Show success alert
      if (onSuccess) {
        onSuccess(); // If there's a success callback, trigger it
      }
      onClose(); // Close the modal after registration
    } catch (error) {
      console.error('Error registering user:', error);
      showAlert('Registration failed. Please try again.', 'danger'); // Show failure alert
    }
    setIsProcessing(false); // End the processing state
  };

  useEffect(() => {
    if (selectedOption === "signin") {
      showLogin();
    }
  }, [selectedOption, showLogin]);

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className="fixed top-0 z-50 inset-0 bg-black opacity-50 w-full h-screen"
        onClick={onClose} // Close when backdrop is clicked
      />
      {/* Modal for Registration Form */}
      <div className="left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 max-w-md mx-auto z-50 fixed flex flex-col bg-white p-6 items-center justify-center rounded-2xl shadow-xl w-[90%] max-w-[500px]">
        <section className="section_middle mx-auto flex justify-center items-center text-[30px] mb-4">
          <h1 className="m-0">Register</h1>
        </section>

        <div className="mb-4 flex flex-col justify-left items-start w-full border-[1px] rounded-[5px]">
          <label className="block px-2 py-1 w-full text-left">
            <input
              type="radio"
              name="paymentMethod"
              value="register"
              checked={selectedOption === "register"}
              onChange={() => setSelectedOption("register")}
            />
            <span className="ml-1 text-[15px]">Register</span>{' '}
            <span className="text-[12px] text-gray-700">Create an account.</span>
          </label>
          <div className="w-full h-[0.5px] bg-gray-200" />
          <label className="block px-2 bg-gray-50 py-1">
            <input
              type="radio"
              name="paymentMethod"
              value="signin"
              checked={selectedOption === "signin"}
              onChange={() => setSelectedOption("signin")}
            />
            <span className="ml-1 text-[15px]">Sign in</span>{' '}
            <span className="text-[12px] text-gray-700">Already a Customer?</span>
          </label>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-3 w-full">
          <span className='text-left flex flex-col w-full'>
            <label className='ml-1 font-medium text-[14px]'>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
            </span>
            <span className='text-left flex flex-col w-full'>
            <label className='ml-1 font-medium text-[14px]'>Phone Number</label>
          <div className="flex space-x-2">
          <input
              type="text"
              name="extention"
              placeholder="+44"
              value={formData.extention}
              onChange={handleChange}
              className=" px-3 w-[70px] py-2 border rounded"
              maxLength="4" // Limit length to 10 digits
              required
            />            <input
              type="text"
              name="phone_number"
              placeholder="Phone Number"
              value={formData.phone_number}
              onChange={handleChange}
              className="flex-1 px-3 py-2 border rounded"
              maxLength="10" // Limit length to 10 digits
              required
            />
          </div>
          </span>
          {/* <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          /> */}
                    {/* <span className='text-left flex flex-col w-full'>
                    <label className='ml-1 font-medium text-[14px]'>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password (min. 6 characters)"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
          </span>
          <span className='text-left flex flex-col w-full'>
          <label className='ml-1 font-medium text-[14px]'>Confirm Password</label>
          <input
            type="password"
            name="conf_password"
            placeholder=""
            value={conf_password}
            onChange={(e) => setConfPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </span> */}
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 font-semibold text-white bg-black rounded-md hover:bg-gray-700 disabled:bg-gray-700"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <PiCircleNotch className="animate-spin text-[30px] m-auto" />
            ) : (
              'Register'
            )}
          </button>
        </form>

        {/* Cancel Button */}
        <button
          className="mt-5 underline"
          onClick={onClose} // Close the modal when clicked
        >
          Cancel
        </button>
      </div>
    </>
  );
};

export default RegisterForm;
