import React, { useState, useCallback, useRef, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from './CropImage'; // Helper function to crop the image
import axios from '../api/axios';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminSideBar from './AdminSideBar';
import { MdOutlineFileUpload } from "react-icons/md";
import AdminSideBarMobile from './AdminSideBarMobile';
import UploadImages from './UploadImages';
import { useAlert } from '../context/AlertContext'; // import the useAlert hook
import { PiCircleNotch } from 'react-icons/pi';


const UploadProduct = () => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    weight: '',
    stock: '',
  });

  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const {showAlert} = useAlert();
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
  const [isThobe, setIsThobe] = useState(true);

  const [gender, setGender] = useState(null);
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [brand, setBrand] = useState(null);
  const [finish, setFinish] = useState(null);
  const [thobeWidth, setThobeWidth] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/category/type'); // Assuming this endpoint returns categories by type
        setCategoriesByType(response.data);
        console.log(response.data)
        console.log(response.data['1'].items)
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

// Add to your useEffect for setting the default category when isThobe is true
useEffect(() => {
  if (isThobe && categoriesByType['1']) {
    const womenCategory = categoriesByType['1'].items.find(
      (category) => category.category_name === 'Women'
    );
    if (womenCategory) {
      setGender(womenCategory); // Automatically set gender to 'Women'
      
      // Add "Women" to selectedCategories if it's not already there
      setSelectedCategories((prevSelected) => {
        // Filter out any existing gender category from the selected categories
        const updatedCategories = prevSelected.filter(
          (selected) => selected.category_group_id !== womenCategory.category_group_id
        );

        // Add "Women" to selectedCategories if it's not already there
        if (!updatedCategories.some((selected) => selected.category_id === womenCategory.category_id)) {
          return [...updatedCategories, womenCategory];
        }
        return updatedCategories;
      });
    }
  }
}, [isThobe, categoriesByType]);



  const toggleThobe = () => {
    setGender(null);
    setSize(null);
    setColor(null);
    setBrand(null);
    setFinish(null);
    setThobeWidth(null);
    setIsThobe(!isThobe); // Toggle the sidebar visibility
  };
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
    // Toggle between selecting and deselecting the category
    setCategory((prev) => (prev && prev.category_id === category.category_id ? null : category));
  
    setSelectedCategories((prevSelected) => {
      // Check if there is an existing category with the same category_group_id
      const updatedCategories = prevSelected.filter(
        (selected) => selected.category_group_id !== category.category_group_id
      );
  
      // If the new category is not already selected, add it to the filtered list
      if (!updatedCategories.some((selected) => selected.category_id === category.category_id)) {
        return [...updatedCategories, category];
      }
      
      return updatedCategories;
    });
    // Convert selectedCategories to a list of category IDs
    const categoryIds = selectedCategories.map((category) => category.category_id);
    console.log(selectedCategories);
    console.log(categoryIds);
  };
  

  const renderCategoryList = (categories, selectedCategory, setCategory) => (
    <ul className="space-y-2 font-medium">
      {categories.items.map((category) => (
        <li key={category.category_id}>
          <div
            onClick={() => handleCategoryClick(category, setCategory)}
            className={`flex items-center p-2 text-[13px] text-gray-900 rounded-lg hover:bg-gray-200 group cursor-pointer ${
              selectedCategory && selectedCategory.category_id === category.category_id ? 'bg-gray-200' : ''
            }`}
          >
            <input
              type="radio"
              checked={selectedCategory && selectedCategory.category_id === category.category_id}
              readOnly
              className="mr-2"
            />
            <span className="ml-5">{category.category_name}</span>
          </div>
        </li>
      ))}
    </ul>
  );
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
  
    if (!productData.images) {
      showAlert('Please upload an image first', 'danger')
      // alert('Please upload an image first');
      setIsProcessing(false);
      return;
    }
  
    // Generate product name for Thobe based on brand, width, and finish
    let generatedName = productData.name; // Default name
  
    if (isThobe) {
      console.log(brand)
      // Check if the required categories (brand, width, finish) are selected
      if (brand && thobeWidth && finish) {
        // Generate the product name using the category_name properties
        generatedName = `${brand.category_name} ${thobeWidth.category_name} ${finish.category_name}`.trim();
      } else {
        // Alert the user if any required Thobe categories are not selected
        showAlert('Please select brand, width, and finish for the Thobe.', 'warning');
        setIsProcessing(false);
        return;
      }
    }
  
    let prod_type = isThobe ? 2 : 1;
  
    // Update product name in the product data
    const productDetails = {
      ...productData,
      name: generatedName,
      // imageUrl: croppedImage,
      categories: selectedCategories, // Add selected categories to the product details
      product_type_id: prod_type,
    };

    

    // Convert selectedCategories to a list of category IDs
    const categoryIds = selectedCategories.map((category) => category.category_id);
    console.log('categoryids')
    console.log(categoryIds)

    // create formdata object to be passed to server
    const formData = new FormData();
    formData.append('name', generatedName);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('weight', productData.weight);
    formData.append('stock', productData.stock);
    console.log('Categories:');
    console.log(selectedCategories);
    formData.append('categories', categoryIds);
    formData.append('product_type_id', productData.product_type_id);


    // Append multiple files
    productData.images.forEach((cropObject, index) => {
      console.log(cropObject);
      const file = new File(
        [cropObject.file],
        cropObject.fileName,
        { type: `image/${cropObject.fileExtension}` }
      );
      formData.append('files', file);
    });
      

    try {
      const response = await axios.post('/api/admin/saveProduct', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
  
      showAlert('Product saved successfully', 'success')
      navigate('/admin/products');
    } catch (error) {
      if (error.response && error.response.status === 403) {
        // Navigate to admin login if unauthorized
        window.location.reload();
      } else {
        alert('Failed to save product.');
      }
    }
    setIsProcessing(false);
  };

  const handleImagesChange = (images) => {
    
    setProductData({ ...productData, images });
    console.log('below is output from handleImagesChange()')
    console.log(productData.images)
  };
  
  

  return (
    <>
      <AdminSideBarMobile />
      <div className='md:ml-64'>
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg text-left">
          <h1 className="text-2xl font-bold text-center mb-6">New Product</h1>
          <label className="block mb-2 text-sm font-medium">Is this a Thobe?</label>
          <ul className="space-y-2 font-medium mb-2">

          <li>
          <div
            onClick={toggleThobe}
            className={`flex items-center p-2 text-[13px] text-gray-900 rounded-lg hover:bg-gray-200 group cursor-pointer ${
              isThobe? 'bg-gray-200' : ''
            }`}
          >
            <input
              type="radio"
              checked={isThobe}
              readOnly
              className="mr-2"
            />
            <span className="ml-5">Yes</span>
          </div>
        </li>
        <li>
          <div
            onClick={toggleThobe}
            className={`flex items-center p-2 text-[13px] text-gray-900 rounded-lg hover:bg-gray-200 group cursor-pointer ${
              !isThobe? 'bg-gray-200' : ''
            }`}
          >
            <input
              type="radio"
              checked={!isThobe}
              readOnly
              className="mr-2"
            />
            <span className="ml-5">No</span>
          </div>
        </li>
        </ul>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium">Product Name</label>
              <input
                type="text"
                name="name"
                placeholder={isThobe ? "Generated Automatically for Thobes" : "e.g. Black Thobe"}
                value={productData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isThobe}
                required
              />
            </div>

            {!isThobe && (<div>
              <label className="block mb-2 text-sm font-medium">Product Description</label>
              <textarea
                name="description"
                placeholder="e.g. fine black silk"
                value={productData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>)}

            {categoriesByType['1'] && (
              <div className="w-full mb-6">
                <div className="line h-[1px] bg-gray-400 my-3" />
                <h1 className="text-black-300 text-[15px] text-left font-semibold capitalize">
                  Gender
                </h1>
                {renderCategoryList(categoriesByType['1'], gender, setGender)}
              </div>
            )}
            {categoriesByType['2'] && (
              <div className="w-full mb-6">
                <div className="line h-[1px] bg-gray-400 my-3" />
                <h1 className="text-black-300 text-[15px] text-left font-semibold capitalize">
                  Size
                </h1>
                {renderCategoryList(categoriesByType['2'], size, setSize)}
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
            {isThobe && categoriesByType['3'] && (
              <div className="w-full mb-6">
                <div className="line h-[1px] bg-gray-400 my-3" />
                <h1 className="text-black-300 text-[15px] text-left font-semibold capitalize">
                  Brand
                </h1>
                {renderCategoryList(categoriesByType['3'], brand, setBrand)}
              </div>
            )}
            {isThobe && categoriesByType['4'] && (
              <div className="w-full mb-6">
                <div className="line h-[1px] bg-gray-400 my-3" />
                <h1 className="text-black-300 text-[15px] text-left font-semibold capitalize">
                  Width
                </h1>
                {renderCategoryList(categoriesByType['4'], thobeWidth, setThobeWidth)}
              </div>
            )}
            {isThobe && categoriesByType['5'] && (
              <div className="w-full mb-6">
                <div className="line h-[1px] bg-gray-400 my-3" />
                <h1 className="text-black-300 text-[15px] text-left font-semibold capitalize">
                  Finish
                </h1>
                {renderCategoryList(categoriesByType['5'], finish, setFinish)}
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

            <div>
              <label className="block mb-2 text```javascript
                font-medium">Weight (grams)</label>
              <input
                type="number"
                name="weight"
                placeholder="Weight in grams"
                value={productData.weight}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* <div className='border-2'>
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
            </div> */}

            {/* Popup cropper in the center of the screen */}
            {/* {imageSrc && (
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
                      aspect={3 / 4}
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
            )} */}

            {/* {croppedImage && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium">Uploaded Image Preview:</p>
                <img src={croppedImage} alt="Uploaded Image" className="w-full h-auto rounded-md shadow-md" />
              </div>
            )} */}

            <UploadImages onImagesChange={handleImagesChange} />


            <button
              type="submit"
              className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:hover:bg-green-600"
              disabled={isProcessing}
            >
              {isProcessing ? <PiCircleNotch className="animate-spin text-[30px] m-auto" /> : <span>Save Product</span>}
            </button>

          </form>
        </div>
      </div>
    </>
  );
};

export default UploadProduct;
