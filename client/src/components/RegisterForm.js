import React, { useState } from 'react';
import axios from '../api/axios';
import { useAlert } from '../context/AlertContext'; // Importing the useAlert hook
import { PiCircleNotch } from "react-icons/pi";

const RegisterForm = ({ onClose, onSuccess }) => {
  const { showAlert } = useAlert(); // Using the alert context
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    phone_number: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true); // Start the processing state
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

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className="fixed top-0 z-50 inset-0 bg-black opacity-50 w-full h-screen"
        onClick={() => onClose()} // Close when backdrop is clicked
      />

      {/* Modal for Registration Form */}
      <div className="left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 max-w-md mx-auto z-50 fixed flex flex-col bg-white p-6 items-center justify-center rounded-2xl shadow-xl w-[90%] max-w-[500px]">
        <section className="section_middle mx-auto flex justify-center items-center text-[30px] mb-4">
          <h1 className="m-0">Register</h1>
        </section>
        
        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-3 w-full">
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="text"
            name="phone_number"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
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
