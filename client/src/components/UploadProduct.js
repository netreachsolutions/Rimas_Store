// src/components/ProductUpload.js
import React, { useState } from 'react';
import axios from '../api/axios';

const UploadProduct = () => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: null,
  });

  const token = localStorage.getItem('token');
  const [imageUrl, setImageUrl] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleImageChange = (e) => {
    setProductData({ ...productData, image: e.target.files[0] });
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append('file', productData.image);

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


    if (!imageUrl) {
      alert('Please upload an image first');
      return;
    }

    const productDetails = {
      ...productData,
      imageUrl,
    };

    try {
      const response = await fetch('http://localhost:4242/api/admin/saveProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the Bearer token in the headers
        },
        body: JSON.stringify(productDetails), // Send the product data as a JSON string
      });
  
      // Check if the response is OK (status code 200-299)
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const data = await response.json(); // Parse the response JSON
      console.log(data);
      alert(data.message); // Show the message from the response
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product.');
    }

    // try {
    //   alert('hihi')
    //   const response = await axios.post('/api/admin/saveProduct', productDetails, {
    //     headers: { Authorization: `Bearer ${token}` },
    //   });
    //   console.log(response)
    //   alert(response.data.message);
    // } catch (error) {
    //   console.error('Error saving product:', error);
    // }
  };

  return (
    <div>
      <h1>Upload Product</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={productData.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Product Description"
          value={productData.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={productData.price}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={productData.stock}
          onChange={handleChange}
          required
        />
        <input type="file" onChange={handleImageChange} required />
        <button type="button" onClick={handleImageUpload}>
          Upload Image
        </button>
        <button type="submit">Save Product</button>
      </form>
    </div>
  );
};

export default UploadProduct;
