// EditProfileField.js
import React, { useState } from "react";
import axios from "../api/axios";
import { useAlert } from "../context/AlertContext";

const EditProfileField = ({ field, fieldLabel, initialValue, onClose, onSave }) => {
  const [value, setValue] = useState(initialValue);
  const [firstName, setFirstName] = useState(initialValue.first_name || ""); // Separate state for first name
  const [lastName, setLastName] = useState(initialValue.last_name || "");   // Separate state for last name
  const [error, setError] = useState('');
  const {showAlert} = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
  
      if (field === 'name') {
        // Separate requests for first_name and last_name
        await axios.post(
          `api/users/updateProfile`,
          {
            fieldName: 'first_name',
            value: firstName
           },
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        await axios.post(
          `api/users/updateProfile`,
          {
            fieldName: 'last_name',
            value: lastName
           },
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        onSave({ first_name: firstName, last_name: lastName });
      } else {
        // Single request for other fields
        await axios.post(
          `api/users/updateProfile`,
          {
            fieldName: field,
            value: value
           },
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        onSave(value);
      }
      showAlert('Updated Successfully', 'success')
      onClose();
    } catch (err) {
      setError("Error updating profile");
      console.error("Error updating profile:", err);
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-[400px]">
        <h3 className="text-lg font-bold mb-4">Edit {fieldLabel}</h3>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit}>
          {field === "name" ? (
            <>
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 mb-4 border rounded-lg"
                required
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 mb-4 border rounded-lg"
                required
              />
            </>
          ) : (
            <input
              type="text"
              name={field}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-4 py-2 mb-4 border rounded-lg"
              required
            />
          )}
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg mr-2">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileField;
