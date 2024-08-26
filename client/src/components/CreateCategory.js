// src/components/ProductUpload.js
import React, { useState } from 'react';
import axios from '../api/axios';

const CreateCategory = () => {
  const [categoryData, setcategoryData] = useState({
    name: '',
    description: ''
  });

  const token = localStorage.getItem('token');
  const [imageUrl, setImageUrl] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setcategoryData({ ...categoryData, [name]: value });
  };

  const handleImageChange = (e) => {
    setcategoryData({ ...categoryData, image: e.target.files[0] });
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append('file', categoryData.image);

    try {
      const response = await axios.post('/api/image/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setImageUrl(response.data.imageUrl);
      console.log('imageUrl'+response.data.imageUrl)
      alert('success')
    } catch (error) {
      alert('error')
      console.error('Error uploading image:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    // if (!imageUrl) {
    //   alert('Please upload an image first');
    //   return;
    // }

    const categoryDetails = {
      ...categoryData,
      imageUrl,
    };

    // try {
    //   const response = await fetch('http://localhost:4242/api/category/create', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${token}`, // Include the Bearer token in the headers
    //     },
    //     body: JSON.stringify(categoryDetails), // Send the product data as a JSON string
    //   });
  
    //   // Check if the response is OK (status code 200-299)
    //   if (!response.ok) {
    //     throw new Error(`Error: ${response.status}`);
    //   }
  
    //   const data = await response.json(); // Parse the response JSON
    //   console.log(data);
    //   alert(data.message); // Show the message from the response
    // } catch (error) {
    //   console.error('Error saving product:', error);
    //   alert('Failed to save product.');
    // }

    try {
      alert('hihi')
      const response = await axios.post('/api/category/create', categoryDetails, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response)
      alert(response.data.message);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <div>
      <h1>Create Category</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={categoryData.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Product Description"
          value={categoryData.description}
          onChange={handleChange}
          required
        />
        {/* <input type="file" onChange={handleImageChange} />
        <button type="button" onClick={handleImageUpload} disabled='true'>
          Upload Image
        </button> */}
        <button type="submit">Create Category</button>
      </form>
    </div>
  );
};

export default CreateCategory;
