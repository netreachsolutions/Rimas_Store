import React, { useState, useCallback, useRef, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from './CropImage'; // Helper function to crop the image
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import AdminSideBar from './AdminSideBar';
import { MdOutlineFileUpload } from "react-icons/md";

const UploadProduct = () => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
  });

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoriesByType, setCategoriesByType] = useState({});
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const fileInputRef = useRef(null); // Add a ref to the file input field
  const token = localStorage.getItem('token');

  const [gender, setGender] = useState(null);
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [apparel, setApparel] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/category/type'); // Assuming this endpoint returns categories by type
        setCategoriesByType(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

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

  const uploadFile = () => {
    if (fileInputRef.current) {
        fileInputRef.current.click(); // Triggers the file input click event
    }
  };

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

  const handleCategoryClick = (category, setCategory) => {
    const selectedCategoryId = category.category_id;

    setCategory((prev) => (prev === selectedCategoryId ? null : selectedCategoryId));

    setSelectedCategories((prevSelected) => {
      // If the category ID is already selected, remove it, otherwise add it
      if (prevSelected.includes(selectedCategoryId)) {
        return prevSelected.filter((id) => id !== selectedCategoryId);
      } else {
        return [...prevSelected, selectedCategoryId];
      }
    });
    console.log(selectedCategories)
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
      categories: selectedCategories, // Add selected categories to the product details
    };

    try {
      const response = await axios.post('/api/admin/saveProduct', productDetails, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Product saved successfully');
      navigate('/admin');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product.');
    }
  };

  const renderCategoryList = (categories, selectedCategory, setCategory) => (
    <ul className="space-y-2 font-medium">
      {categories.map((category) => (
        <li key={category.category_id}>
          <div
            onClick={() => handleCategoryClick(category, setCategory)}
            className={`flex items-center p-2 text-[13px] text-gray-900 rounded-lg hover:bg-gray-200 group cursor-pointer ${
              selectedCategory === category.category_id ? 'bg-gray-200' : ''
            }`}
          >
            <input
              type="radio"
              checked={selectedCategory === category.category_id}
              readOnly
              className="mr-2"
            />
            <span className="ml-5">{category.category_name}</span>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <AdminSideBar />
      <div className='md:ml-64'>
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg text-left">
          <h1 className="text-2xl font-bold text-center mb-6">New Product</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium">Product Name</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Black Thobe"
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
                placeholder="e.g. fine black silk"
                value={productData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {categoriesByType.gender && (
              <div className="w-full mb-6">
                <div className="line h-[1px] bg-gray-400 my-3" />
                <h1 className="text-black-300 text-[15px] text-left font-semibold capitalize">
                  Gender
                </h1>
                {renderCategoryList(categoriesByType.gender, gender, setGender)}
              </div>
            )}
            {categoriesByType.size && (
              <div className="w-full mb-6">
                <div className="line h-[1px] bg-gray-400 my-3" />
                <h1 className="text-black-300 text-[15px] text-left font-semibold capitalize">
                  Size
                </h1>
                {renderCategoryList(categoriesByType.size, size, setSize)}
              </div>
            )}
            {categoriesByType.color && (
              <div className="w-full mb-6">
                <div className="line h-[1px] bg-gray-400 my-3" />
                <h1 className="text-black-300 text-[15px] text-left font-semibold capitalize">
                  Color
                </h1>
                {renderCategoryList(categoriesByType.color, color, setColor)}
              </div>
            )}
            {categoriesByType.apparel && (
              <div className="w-full mb-6">
                <div className="line h-[1px] bg-gray-400 my-3" />
                <h1 className="text-black-300 text-[15px] text-left font-semibold capitalize">
                  Apparel
                </h1>
                {renderCategoryList(categoriesByType.apparel, apparel, setApparel)}
              </div>
            )}

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
              <label className="block mb-2 text```javascript
                font-medium">Stock</label>
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

            <div className='border-2'>
              <input
                type="file"
                style={{ display: 'none' }} 
                onChange={handleImageChange}
                className="w-full"
                required
                ref={fileInputRef}
              />
                <div className='w-full text-center hover:cursor-pointer' onClick={uploadFile}>
                  <MdOutlineFileUpload className='m-auto text-[40px] text-gray-600'/>
                   <label className="block mb-2 text-sm font-medium hover:cursor-pointer">Upload Image</label>
                </div>
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
      </div>
    </>
  );
};

export default UploadProduct;
