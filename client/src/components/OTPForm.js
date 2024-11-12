// OTPForm.js
import React, { useEffect, useRef } from 'react';
import { PiCircleNotch } from 'react-icons/pi';

const OTPForm = ({ otp, onOtpChange, onVerify, loading, error, message, restart }) => {
  const inputRefs = useRef([]);

  // Focus on the first empty box initially
  useEffect(() => {
    focusFirstEmptyBox();
  }, []);

  const focusFirstEmptyBox = () => {
    const firstEmptyIndex = otp.findIndex((digit) => digit === '');
    if (firstEmptyIndex !== -1) {
      inputRefs.current[firstEmptyIndex]?.focus();
    }
  };

  const handleOtpChange = (value, index) => {
    // Remove any non-digit characters and take only the last character if multiple are entered
    const newValue = value.replace(/\D/g, '').slice(-1);

    if (newValue) {
      onOtpChange(newValue, index);

      // Move to the next input if the value is a digit and within bounds
      if (index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    } else {
      // If the input is cleared, update the state
      onOtpChange('', index);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        // Clear the current box
        onOtpChange('', index);
      } else if (index > 0) {
        // Move focus to the previous input and clear it
        inputRefs.current[index - 1]?.focus();
        onOtpChange('', index - 1);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      // Move to the previous input
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < otp.length - 1) {
      // Move to the next input
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData('Text')
      .replace(/\D/g, '')
      .slice(0, otp.length); // Limit to OTP length

    const newOtpArray = Array(otp.length).fill('');
    pasteData.split('').forEach((char, i) => {
      newOtpArray[i] = char;
    });

    // Update the OTP state with the new array
    onOtpChange(newOtpArray);

    // Focus on the next empty input after pasting
    const nextIndex = pasteData.length < otp.length ? pasteData.length : otp.length - 1;
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="flex flex-col space-y-5">
        <div className='flex justify-between mb-10'>
        <button
            className="w-full px-2 w-max bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
            onClick={restart}
        >
            Back
        </button>
        {/* <button
            className="w-full w-max px-2 bg-blue-400 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
        >
            Edit Number
        </button> */}
        </div>
      <div className="flex space-x-2 justify-center mb-5">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            value={digit}
            maxLength="1"
            onChange={(e) => handleOtpChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            ref={(el) => (inputRefs.current[index] = el)}
            className="w-[60px] h-[80px] text-center border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}
      </div>
      <button
        className="w-full py-2 px-4 font-semibold text-white bg-black rounded-md hover:bg-gray-700"
        onClick={onVerify}
        disabled={loading}
      >
        {loading ? <PiCircleNotch className="animate-spin text-[30px] m-auto" /> : 'Verify OTP'}
      </button>
      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default OTPForm;
