// OTPForm.js
import React, { useEffect, useRef, useState, } from 'react';
import { PiCircleNotch } from 'react-icons/pi';
import { useAlert } from '../context/AlertContext';
import axios from '../api/axios';
import { useLogin } from '../context/LoginContext';

const RegisterNameForm = ({ otp, onClose, onOtpChange, onVerify, method, formData, error, message }) => {
  const inputRefs = useRef([]);
  const [name, setName] = useState('')
  const {auth} = useLogin();
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const register = async () => {
    setLoading(true);
    showAlert(otp)
    try {
      const phone = formData.extention + formData.phone_number;
      const register_token = localStorage.getItem('register_token');
      const response = await axios.post('/api/users/register', 
            method === 'email' ? {
                email: formData.email,
                name: name,
                otp: otp.join(''),
                method: method 
            }
            :
            { 
                phone: phone,
                name: name,
                otp: otp.join(''),
                method: method
            },
            {headers: { Authorization: `Bearer ${register_token}` }});
        console.log('register response')
        console.log(response.data)
      if (response.data.type == 'login') {
        localStorage.setItem('token', response.data.token);
        showAlert('Logged in Succesfully', 'success');
        onClose();
        auth();

      }
    } catch (err) {
        console.log(err)
      showAlert('Error on Registration', 'danger');
    //   showAlert('Invalid Code', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Focus on the first empty box initially
 
  return (
    <div className="flex flex-col space-y-5">
      <div className="flex space-x-2 justify-center my-5">
      <input
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-3 py-2 border rounded"
            maxLength="30"
            required
        />
      <button
        className="w-full py-2 px-4 font-semibold text-white bg-black rounded-md hover:bg-gray-700"
        onClick={register}
        disabled={loading}
      >
        {loading ? <PiCircleNotch className="animate-spin text-[30px] m-auto" /> : 'Shop Now'}
      </button>
      </div>
      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default RegisterNameForm;
