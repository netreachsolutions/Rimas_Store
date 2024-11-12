// SignInForm.js
import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAlert } from '../context/AlertContext';
import { useLogin } from '../context/LoginContext';
import PhoneEmailForm from './PhoneEmailForm';
import OTPForm from './OTPForm';
import RegisterNameForm from './RegisterNameForm';

const SignInForm = ({ onClose, onSuccess }) => {
  const { showRegister, auth, hideLogin } = useLogin();
  const { showAlert } = useAlert();
  const [isProcessing, setIsProcessing] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [method, setMethod] = useState("phone");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ extention: '', phone_number: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFormDataChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    if (Array.isArray(value)) {
      newOtp.splice(index, value.length, ...value);
    } else {
      newOtp[index] = value;
    }
    setOtp(newOtp);
  };

  const sendOTP = async (e) => {
    showAlert(formData.phone_number)
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/users/otp', method === 'email' ? { email: formData.email, method: method } : { extention: formData.extention, phone_number: formData.phone_number, method: method});
      setMessage(response.data.message);
      showAlert(response.data.message, 'success');
      setStep(2);
    } catch (err) {
      setError('Failed to send OTP');
      showAlert('Failed to send', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    setLoading(true);
    showAlert(otp)
    try {
      const response = await axios.post('/api/users/otp/verify',
            method === 'email' ? 
            {
                email: formData.email,
                otp: otp.join(''), 
                method: method
            }
            :
            { 
                extention: formData.extention, 
                phone_number: formData.phone_number, 
                otp: otp.join(''), 
                method: method
            });
      if (response.data.type == 'login') {
        localStorage.setItem('token', response.data.token);
        showAlert('Logged in Succesfully', 'success');
        // onSuccess();
        onClose();
        // hideLogin();
        auth();

      } else {
        console.log('response')
            console.log(response.data)
          localStorage.setItem('register_token', response.data.token);
          setMessage('OTP verified. You can now reset your password.');
          setStep(3);

      }
    } catch (err) {
      setError('Invalid OTP');
    //   showAlert('Invalid Code', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const restart = () => {
    setStep(1)
  }



  return (
    <>
      <div className="fixed top-0 z-50 inset-0 bg-black opacity-50 w-full h-screen" onClick={onClose} />
      <div className="left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 max-w-md mx-auto z-50 fixed flex flex-col bg-white p-6 items-center justify-center rounded-2xl shadow-xl w-[90%] max-w-[500px]">
        {step === 1 && (
          <PhoneEmailForm
            method={method}
            formData={formData}
            onMethodChange={setMethod}
            onFormDataChange={handleFormDataChange}
            onSubmit={sendOTP}
            // onSubmit={setStep(3)}
            isProcessing={isProcessing}
          />
        )}
        {step === 2 && (
          <OTPForm
            otp={otp}
            onOtpChange={handleOtpChange}
            onVerify={verifyOTP}
            loading={loading}
            message={message}
            error={error}
            restart={restart}
          />
        )}
        {step === 3 && (
          <RegisterNameForm
            otp={otp}
            onOtpChange={handleOtpChange}
            formData={formData}
            method={method}
            onVerify={verifyOTP}
            loading={loading}
            message={message}
            error={error}
            onClose={onClose}
          />
        )}
      </div>
    </>
  );
};

export default SignInForm;
