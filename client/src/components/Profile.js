import React, { useState, useEffect } from 'react';
import NavBar from "./NavBar"
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [newAddress, setNewAddress] = useState({
    first_line: '',
    second_line: '',
    city: '',
    postcode: '',
    country: '',
    is_default: false,
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data)
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (error.response && error.response.status === 403) {
          navigate('/login');
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    alert(newAddress.country)
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'api/users/address/new',
        { address: newAddress },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(newAddress)
      // Refresh profile data after adding address
      const updatedProfile = await axios.get('api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(updatedProfile)
      setProfileData(updatedProfile.data.customer);
      setNewAddress({
        first_line: '',
        second_line: '',
        city: '',
        postcode: '',
        country: '',
        is_default: false,
      });
    } catch (error) {
      setError('Error adding address');
      console.error('Error adding address:', error);
    }
  };

  if (!profileData) {
    return <div className="text-center text-lg font-semibold mt-8"><Spinner/></div>;
  }

  return (
    <><NavBar />
    <div className="container mx-auto my-10 p-6 bg-white shadow-md rounded-lg">
      
      <h2 className="text-3xl font-bold mb-6 text-center">Profile</h2>
      <div className="border-b border-gray-300 pb-4">
        <p className="text-lg mb-2"><strong>Email:</strong> {profileData.email}</p>
        <p className="text-lg mb-2"><strong>Name:</strong> {profileData.first_name} {profileData.last_name}</p>
        <p className="text-lg mb-2"><strong>Phone:</strong> {profileData.phone_number}</p>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">Addresses</h3>
        {profileData.addresses && profileData.addresses.length > 0 ? (
          <ul className="space-y-4">
            {profileData.addresses.map((address) => (
              <li key={address.address_id} className="bg-gray-100 p-4 rounded-lg">
                <p className="text-lg">{address.first_line}, {address.city}, {address.postcode}, {address.country}</p>
                {address.is_default && <p className="text-sm text-green-600">(Default Address)</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No addresses found.</p>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">Add New Address</h3>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleAddAddress} className="space-y-4">
          <input
            type="text"
            name="first_line"
            placeholder="Address Line 1"
            value={newAddress.first_line}
            onChange={handleAddressChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="second_line"
            placeholder="Address Line 2"
            value={newAddress.second_line}
            onChange={handleAddressChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={newAddress.city}
            onChange={handleAddressChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="postcode"
            placeholder="Postcode"
            value={newAddress.postcode}
            onChange={handleAddressChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={newAddress.country}
            onChange={handleAddressChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_default"
              checked={newAddress.is_default}
              onChange={handleAddressChange}
              className="mr-2"
            />
            <label className="text-lg">Set as default address</label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
          >
            Add Address
          </button>
        </form>
      </div>
    </div></>
    
  );
};

export default Profile;
