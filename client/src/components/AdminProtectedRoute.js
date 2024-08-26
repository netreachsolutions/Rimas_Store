// src/components/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import axios from '../api/axios';

const AdminProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');

    const auth = async (token) => {
      try {
        const response = await axios.get('api/admin/verify', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          throw new Error('Token validation failed');
        }
      } catch (error) {
        console.error('Token is invalid or expired:', error);
        localStorage.removeItem('token'); // Clear the token if it's invalid
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      auth(token);
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner if preferred
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/adminLogin" state={{ from: location }} replace />;
};

export default AdminProtectedRoute;
