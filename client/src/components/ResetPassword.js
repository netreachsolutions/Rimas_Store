import React, { useState } from 'react';
import axios from '../api/axios';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // Step 1: Enter email, Step 2: Enter OTP
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Handle sending OTP
  const sendOTP = async () => {
    try {
      const response = await axios.post('/api/users/otp', { email });
      setMessage(response.data.message);
      setStep(2); // Move to OTP input step
    } catch (err) {
      setError('Failed to send OTP');
      console.error(err);
    }
  };

  // Handle OTP verification
  const verifyOTP = async () => {
    try {
      const response = await axios.post('/api/users/otp/verify', { email, otp });
      setMessage('OTP verified, you can now reset your password');
      // You can redirect to the password reset page here.
    } catch (err) {
      setError('Invalid OTP');
      console.error(err);
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
    <div className="reset-password-container">
      {step === 1 && (
        <div className='space-y-3'>
          {/* <h2>Reset Password</h2> */}
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"

          />
          <button  className="w-full py-2 px-4 font-semibold text-white bg-black rounded-md hover:bg-gray-700"
                    onClick={sendOTP}>Send OTP</button>
          {message && <p>{message}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}
      {step === 2 && (
        <div>
          <h2>Enter OTP</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOTP}>Verify OTP</button>
          {message && <p>{message}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}
    </div>
    </div>
  );
};

export default ResetPassword;
