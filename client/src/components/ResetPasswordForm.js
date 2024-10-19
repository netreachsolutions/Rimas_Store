import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useLogin } from '../context/LoginContext'; // Assuming LoginContext is used for managing modal visibility and authentication state
import Spinner from './Spinner'; // Assuming Spinner component is shared
import { useAlert } from '../context/AlertContext';

const ResetPasswordForm = ({ onClose, onSuccess }) => {
  const { showLogin, hideLogin } = useLogin(); // Manage login/reset modal visibility
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // Step 1: Enter email, Step 2: Enter OTP, Step 3: Reset Password
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPass, setVerifyPass] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for async operations
  const {showAlert} = useAlert();

  const sendOTP = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/users/otp', { email });
      setMessage(response.data.message);
      showAlert(response.data.message, 'success')
      setStep(2); // Move to OTP input step
    } catch (err) {
      setError('Failed to send OTP');
      showAlert('Failed to send', 'danger');

      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/users/otp/verify', { email, otp });
      localStorage.setItem('otp-token', response.data.accessToken);
      setMessage('OTP verified. You can now reset your password.');
      setStep(3); // Move to reset password step
    } catch (err) {
      setError('Invalid OTP');
      showAlert('Invalid Code', 'danger');

      console.error(err);
    } finally {
      setLoading(false);
    }
  };



  const handleReset = async () => {
    if (password !== verifyPass) {
      setError("Passwords don't match");
      showAlert("Passwords don't match", 'warning');

      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('otp-token');
      const response = await axios.post('/api/users/reset', { email, pass: password }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Password reset successfully');
      showAlert("Password reset successfully", 'success');

      setIsDisabled(true);
      setTimeout(() => {
        hideLogin(); // Close reset form
        showLogin(); // Show login form after reset
      }, 2000);
    } catch (err) {
      setError('Error updating password');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
          <div className="fixed top-0 z-50 inset-0 bg-black opacity-50 w-full h-screen" onClick={onClose} />

          <div className="left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 max-w-md mx-auto z-50 fixed flex flex-col bg-white p-6 items-center justify-center rounded-2xl shadow-xl w-[90%] max-w-[500px]">
          <section className="section_middle mx-auto mb-6 flex justify-center items-center text-[40px]">
        <h1 className="m-0">RIMAS</h1>
        <img className="h-[60px] mx-[2px]" src="/images/diamond.png" alt="Diamond Logo" />
        <h1 className="m-0">STORE</h1>
      </section>

      {loading ? (
        <Spinner /> // Show spinner during async requests
      ) : (
        <div className="reset-password-container space-y-4">
          {step === 1 && (
            <div className='space-y-3'>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
              <button
                className="w-full py-2 px-4 font-semibold text-white bg-black rounded-md hover:bg-gray-700"
                onClick={sendOTP}
                disabled={!email}
              >
                Send Reset Link
              </button>
              {message && <p className="text-green-500">{message}</p>}
              {error && <p className="text-red-500">{error}</p>}
            </div>
          )}

          {step === 2 && (
            <div>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
              <button
                className="w-full py-2 px-4 font-semibold text-white bg-black rounded-md hover:bg-gray-700"
                onClick={verifyOTP}
                disabled={!otp}
              >
                Verify OTP
              </button>
              {message && <p className="text-green-500">{message}</p>}
              {error && <p className="text-red-500">{error}</p>}
            </div>
          )}

          {step === 3 && (
            <div>
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="password"
                placeholder="Confirm password"
                value={verifyPass}
                onChange={(e) => setVerifyPass(e.target.value)}
                className="w-full px-3 py-2 border rounded mt-2"
              />
              <button
                className="w-full py-2 px-4 font-semibold text-white bg-black rounded-md hover:bg-gray-700"
                onClick={handleReset}
                disabled={isDisabled || !password || !verifyPass}
              >
                Reset Password
              </button>
              {/* {message && <p className="text-green-500">{message}</p>} */}
              {error && <p className="text-red-500">{error}</p>}
            </div>
          )}
        </div>
      )}
    </div>
    </>
  );
};

export default ResetPasswordForm;
