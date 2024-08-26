import React, { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from './CropImage'; // Helper function to crop the image
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const UploadProduct = () => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
  });

  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const fileInputRef = useRef(null); // Add a ref to the file input field
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', () => setImageSrc(reader.result));
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleImageUpload = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels); // Crop the image
      const formData = new FormData();
      formData.append('file', croppedImageBlob);

      const response = await axios.post('/api/image/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setCroppedImage(response.data.imageUrl); // Save the cropped image URL
      setImageSrc(null); // Close the image cropping editor
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image.');
    }
  };

  const handleCloseCrop = () => {
    setImageSrc(null); // Close the cropper
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset the file input field value
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!croppedImage) {
      alert('Please crop and upload an image first');
      return;
    }

    const productDetails = {
      ...productData,
      imageUrl: croppedImage,
    };

    try {
      const response = await fetch('http://localhost:4242/api/admin/saveProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the Bearer token in the headers
        },
        body: JSON.stringify(productDetails),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      alert(data.message); // Show the message from the response
      navigate('/admin');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Upload Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 text-sm font-medium">Product Name</label>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={productData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Product Description</label>
          <textarea
            name="description"
            placeholder="Product Description"
            value={productData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Price</label>
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={productData.price}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Stock</label>
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={productData.stock}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Upload Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full"
            required
            ref={fileInputRef} // Add the ref to the file input
          />
        </div>

        {/* Popup cropper in the center of the screen */}
        {imageSrc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative bg-white p-6 pt-[55px] x-6 max-w-[500px] rounded-lg shadow-lg w-3/4 h-4/5">
              <button
                onClick={handleCloseCrop}
                className="absolute top-3 right-6 bg-red-500 text-white px-4 py-1 rounded-md z-50 hover:bg-red-600"
              >
                Close
              </button>
              <div className="crop-container" style={{ position: 'relative', width: '100%', height: '400px' }}>
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={4 / 3}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <button
                type="button"
                onClick={handleImageUpload}
                className="mt-4 w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
              >
                Upload Cropped Image
              </button>
            </div>
          </div>
        )}

        {croppedImage && (
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium">Uploaded Image Preview:</p>
            <img src={croppedImage} alt="Uploaded Image" className="w-full h-auto rounded-md shadow-md" />
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
        >
          Save Product
        </button>
      </form>
    </div>
  );
};

export default UploadProduct;
