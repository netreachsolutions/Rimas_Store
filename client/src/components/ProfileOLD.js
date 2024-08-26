// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log(token)
        const response = await axios.get(`api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData(response.data.customer);
        console.log('Response: '+response)
      } catch (error) {
        console.error('Error fetching profile:', error);

        if (error.response && error.response.status === 403) {
          // Redirect to login page if the status code is 403
          // navigate('/login');
        }
      }
    };

    fetchProfile();
  }, []);

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile">
      <h2>Profile</h2>
      <p>Email: {profileData.email}</p>
      <p>Name: {profileData.first_name} {profileData.last_name}</p>
      <p>Phone: {profileData.phone_number}</p>
    </div>
  );
};

// export default Profile;
