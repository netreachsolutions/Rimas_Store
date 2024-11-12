import React, { useState, useEffect } from 'react';
import NavBar from "./NavBar";
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';
import NewAddress from './NewAddress';
import EditProfileField from './EditProfileField';
import { MdPassword } from 'react-icons/md';
import { useLogin } from '../context/LoginContext';
import Footer from './Footer';

const Profile = () => {
  const {showReset} = useLogin()
  const [profileData, setProfileData] = useState(null);
  const [editField, setEditField] = useState(null); // Track which field is being edited
  const [backdropPosition, setBackdropPosition] = useState('hidden');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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

  const handleEditClick = (field) => {
    if (field == 'password') {
      showReset();
    } else {

      setEditField(field);
    }
  };

  const handleAddressAdded = async () => {
    setBackdropPosition('hidden');
    const token = localStorage.getItem('token');
    try {
      // Refresh profile data after adding address
      const updatedProfile = await axios.get('api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileData(updatedProfile.data);
    } catch (error) {
      console.error('Error refreshing profile data:', error);
    }
  };


  
  const showAddressForm = () => {
    setBackdropPosition('fixed')
  }

  if (!profileData) {
    return <div className="text-center text-lg font-semibold mt-8"><Spinner/></div>;
  }

  const handleSave = (newValue) => {
    setProfileData((prevData) => {
      // if (editField === "name") {
      //   return { ...prevData, first_name: newValue.first_name, last_name: newValue.last_name };
      // }
      return { ...prevData, [editField]: newValue };
    });
    setEditField(null); // Close the editor after saving
  };

  if (!profileData) {
    return <div className="text-center text-lg font-semibold mt-8"><Spinner /></div>;
  }

  return (
    <>
    <div 
        className={`${backdropPosition} z-10 inset-0 bg-black opacity-50 w-full`}
        onClick={() => setBackdropPosition('hidden')}
      />
      {( backdropPosition == 'fixed' ? (
        <NewAddress 
          className={`z-[100]`}
          onAddressAdded={handleAddressAdded} // Pass the callback to hide form on successful submission
        />

      ) : null
        

      )}
      <NavBar />
      <h2 className="text-2xl font-semibold mb-3 text-gray-600 text-left pl-4 md:hidden">Profile</h2>
      <div className="w-max flex md:flex-row flex-col md:gap-5 mx-auto bg-white shadow-md rounded-lg md:mt-7 min-h-[400px]">
        <div className=" border-gray-300 text-left md:border-[1.5px] border-t-[1.5px] md:w-auto w-screen rounded-[5px] h-max">
          {[
            { label: "Name", field: "name", value: `${profileData.name}`, changeable: true},
            { label: "Email", field: "email", changeable: false},
            { label: "Phone", field: "phone_number", changeable: false },
            // { label: "Password", field: "password", value: "************" },
          ].map(({ label, field, value, changeable }) => (
            <span key={field} className="text-lg mb-2 border-b-[1.5px] px-4 py-3 flex justify-between items-center gap-10">
              <div className='flex flex-col'>
                <strong>{label}</strong>
                {value || profileData[field]}
              </div>
              {changeable && (
              <button
                className='font-normal border-[1px] rounded-[8px] w-[100px] h-[80%] border-gray-400 hover:bg-gray-100'
                onClick={() => handleEditClick(field)}
                disabled={!changeable}
              >
                Edit
              </button>

              )

              }
            </span>
          ))}
        </div>
        {/* Addresses Section */}
        <div className="md:border-2 md:w-auto w-screen">
          <div className='flex justify-between gap-4 px-4 pt-5 items-end border-b-2 pb-2'>
            <h3 className="text-2xl font-semibold text-gray-700">Addresses</h3>
            <button
              className={`bg-green-500 text-white px-6 py-1 rounded hover:bg-green-600 transition duration-300`}
              onClick={showAddressForm}
            >
              Add Address
            </button>
          </div>
          {profileData.addresses && profileData.addresses.length > 0 ? (
            <ul className="h-[320px] overflow-y-scroll">
              {profileData.addresses.map((address) => (
                <li key={address.address_id} className="border-b-2 px-3 flex py-4 rounded-lg">
                  <div className='w-[75%] text-left'>
                    <p className="text-sm">{address.first_line}, {address.city}, {address.postcode}, {address.country}</p>
                  </div>
                  <button className='text-gray-500 underline hover:text-gray-600'>Remove</button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No addresses found.</p>
          )}
        </div>
      </div>

      {/* Render Edit Profile Field */}
      {editField && (
        <EditProfileField
          field={editField}
          fieldLabel={editField.charAt(0).toUpperCase() + editField.slice(1)}
          initialValue={profileData[editField]}
          onClose={() => setEditField(null)}
          onSave={handleSave}
        />
      )}
      <Footer/>
    </>
  );
};

export default Profile;
