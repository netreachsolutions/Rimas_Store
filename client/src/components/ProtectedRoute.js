import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation, Navigate } from 'react-router-dom';
import axios from '../api/axios';
import { useLogin } from '../context/LoginContext';
import { useHistory } from '../context/HistoryContext'; // Import the HistoryContext


const ProtectedRoute = () => {
  const { showLogin } = useLogin();
  const { prevLocation } = useHistory(); // Access previous location
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname // Track the original path
  const to = location.pathname; // Track the original path
  // console.log(from)


  useEffect(() => {
    const token = localStorage.getItem('token');

    const auth = async (accessToken) => {
      try {
        const response = await axios.get('api/users/verify', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.status === 200) {
          setIsAuthenticated(true); // User is authenticated
        } else {
          throw new Error('Token validation failed');
        }
      } catch (error) {
        console.error('Token is invalid or expired:', error);
        localStorage.removeItem('token'); // Clear the token if it's invalid
        setIsAuthenticated(false);
        const onSuccess = () => {
          setIsAuthenticated(true);
          navigate(to);
        }
        showLogin(
          onSuccess
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      auth(token);
    } else {
      setLoading(false);
      const onSuccess = () => {
        setIsAuthenticated(true);
        navigate(to);
      }
      showLogin(
        onSuccess
      );
    }
  }, [showLogin, navigate, from]);

  if (loading) {
    return <div>Loading...</div>; // Display a loading spinner while checking authentication
  }

  return isAuthenticated ? <Outlet /> : <Navigate to={prevLocation} replace />; // Don't navigate; just show login modal
};

export default ProtectedRoute;


//   return isAuthenticated ? <Outlet /> : <Navigate to={from} replace />;

