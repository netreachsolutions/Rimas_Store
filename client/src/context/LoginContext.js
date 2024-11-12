import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAlert } from './AlertContext';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm'; // Import RegisterForm
import ResetPasswordForm from '../components/ResetPasswordForm'; // Import ResetPasswordForm
import SignInForm from '../components/SignInForm';

// Create the context
const LoginContext = createContext();

// Custom hook to use the Login context
export const useLogin = () => useContext(LoginContext);

export const LoginProvider = ({ children }) => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [loginState, setLoginState] = useState({ visible: false, mode: 'login', onSuccess: null }); // Add `mode` to toggle between forms
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  // Function to show login form
  const showLogin = (onSuccess) => {
    setLoginState({ visible: true, mode: 'login', onSuccess }); // Set mode to 'login'
  };

  // Function to show register form
  const showRegister = (onSuccess) => {
    setLoginState({ visible: true, mode: 'register', onSuccess }); // Set mode to 'register'
  };

  // Function to show reset password form
  const showReset = (onSuccess) => {
    setLoginState({ visible: true, mode: 'reset', onSuccess }); // Set mode to 'reset'
  };

  // Function to hide login, register, or reset form
  const hideLogin = () => {
    setLoginState({ visible: false, mode: 'login', onSuccess: null });
  };

  // Function to log out the user
  const logout = () => {
    localStorage.removeItem('token'); // Properly clear the token
    setIsLoggedIn(false);
    navigate('/');
    showAlert('Logged Out', 'warning');
  };

  // Function to authenticate the user using the token
  const auth = async () => {
    const accessToken = localStorage.getItem('token');
    if (!accessToken) {
      setIsLoggedIn(false);
      return;
    }

    try {
      const response = await axios.get('api/users/verify', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.status === 200) {
        setIsLoggedIn(true);
      } else {
        throw new Error('Token validation failed');
      }
    } catch (error) {
      console.error('Token is invalid or expired:', error);
      localStorage.removeItem('token'); // Clear invalid token
      setIsLoggedIn(false);
    }
  };

  // Use useEffect to call `auth` on component mount or page navigation
  useEffect(() => {
    auth(); // Check if user is authenticated whenever the component mounts
  }, []);

  // Listen for the back button and close the modal if it’s open
  useEffect(() => {
    const handlePopState = () => {
      if (loginState.visible) {
        hideLogin();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [loginState.visible]);

  return (
    <LoginContext.Provider value={{ showLogin, showRegister, showReset, hideLogin, logout, auth, isLoggedIn }}>
      {children}

      {/* Render the appropriate form based on the mode */}
      {loginState.visible && loginState.mode === 'login' && (
        <SignInForm onClose={hideLogin} onSuccess={loginState.onSuccess} />
      )}
      {loginState.visible && loginState.mode === 'register' && (
        <RegisterForm onClose={hideLogin} onSuccess={loginState.onSuccess} />
      )}
      {loginState.visible && loginState.mode === 'reset' && (
        <ResetPasswordForm onClose={hideLogin} onSuccess={loginState.onSuccess} />
      )}
    </LoginContext.Provider>
  );
};
