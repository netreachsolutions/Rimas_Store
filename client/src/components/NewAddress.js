import React, { useEffect, useState } from 'react';
import imageConfig from '../config/imageConfig';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';


const NewAddress = ({ onAddressAdded }) => {
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState('');

    const [newAddress, setNewAddress] = useState({
        first_line: '',
        second_line: '',
        city: '',
        postcode: '',
        country: '',
        is_default: false,
      });

      const handleAddressChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewAddress((prev) => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value,
        }));
      };

    const handleAddAddress = async (e) => {
        e.preventDefault();
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

            onAddressAdded();
        } catch (error) {
            setError('Error adding address');
            console.error('Error adding address:', error);
        }
    };



    return (
        // <main className={`w-full h-screen ${visibility} z-[100] items-center flex`}
        //     // onClick={() => setVisibility('hidden')}
        // >
        
        
        <div
            className='fixed mx-auto type-container w-[90%] max-w-[1000px] z-[100] bg-white rounded-[15px]'
            style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)', // Ensures the form is centered
              }}
        >
            {/* <div className='fixed inset-0 bg-black opacity-50'></div> */}

            <form onSubmit={handleAddAddress} className="space-y-4 px-[50px] py-10">
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
                    className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
                >
                    Add Address
                </button>
            </form>
            </div>

        // </main>
    );
};

export default NewAddress;
