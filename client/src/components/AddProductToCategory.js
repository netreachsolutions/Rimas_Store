import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import axios from "../api/axios"; // Assuming axios is configured
import AdminSideBar from "./AdminSideBar";

const AddProductToCategory = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [productsNotInCategory, setProductsNotInCategory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [category, setCategory] = useState(null);
  const {categoryID} = useParams();
  const token = localStorage.getItem("token");
  
  const fetchData = async () => {
    try {
      const [categoryResponse, categoryProductsResponse] = await Promise.all([
        axios.get(`/api/category/${categoryID}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`/api/category/${categoryID}/products`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setCategory(categoryResponse.data[0]);
      setProducts(categoryProductsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError('Error fetching category or products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriesProducts = async () => {
    try {
      const categoryProductsResponse = await axios.get(`/api/category/${categoryID}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(categoryProductsResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products from category:", error);
      setError('Error fetching products from category');
      setLoading(false);
    }
  };

  // Fetch categories and products on component mount
  useEffect(() => {
      fetchData();
  }, [categoryID, token]);
    

  // Handle product checkbox selection
  const handleProductSelection = (productId) => {
    setSelectedProducts((prevSelectedProducts) => {
      if (prevSelectedProducts.includes(productId)) {
        // Remove productId from selectedProducts
        return prevSelectedProducts.filter((id) => id !== productId);
      } else {
        // Add productId to selectedProducts
        return [...prevSelectedProducts, productId];
      }
    });
  };

  const removeItemsFromCategory = async (e) => {
    e.preventDefault();

    console.log("Selected products: ", selectedProducts);

    if (selectedProducts.length === 0) {
      alert("Please select at least one product.");
      return;
    }

    try {
      const response = await axios.delete(
        "/api/category/deleteProducts",
        
        {
          headers: { Authorization: `Bearer ${token}` },
          data:{
            productIds: selectedProducts, // Sending array of selected product IDs
            categoryId: categoryID
          }
        }
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error deleting products from category:", error);
      alert("Failed to delete products from category.");
    }
    finally{
      await fetchCategoriesProducts();
    }
  };

  const getAllProductsNotInCategory = async (e) => {
    e.preventDefault();

    try{
      const productsNotInCategoryResponse = await axios.get(`/api/category/${categoryID}/productsNotInCategory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProductsNotInCategory(productsNotInCategoryResponse.data)
      console.log(productsNotInCategory)
    }
    catch(err){
      console.error("Error fetching products not in category: ", err)
    }
  } 

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-row">
      <AdminSideBar />
      <div className="container mx-auto my-8 p-4 flex-grow ml-64">
        <Link to={'/category'}>
          <span className='flex gap-1 items-center rounded-xl py-1 px-1.5 bg-gray-50 w-max  text-gray-500'>
          <IoArrowBackOutline />

          Back to Categories
          </span>
          </Link>
        
          <div className="container mx-auto p-4">
            
          <h1 className="text-2xl font-bold mb-4">All Products in {category.category_name}</h1>
          <form onSubmit={removeItemsFromCategory}>
            {/* Category Selector */}

            {/* Product List */}
            <div>
              <h2 className="text-xl font-medium mb-4">Select Products:</h2>
              {products.length === 0 ? (
                <p className="text-gray-500">No products available.</p>
              ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <li
                      key={product.product_id}
                      className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.product_id)} // Maintain checkbox state
                        onChange={() => handleProductSelection(product.product_id)} // Update state on change
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">
                          {product.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )} 
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                className="px-6 py-3 bg-blue text-black font-semibold rounded-md shadow hover:bg-blue focus:outline-none focus:ring-2 focus:ring-blue"
              >
                Remove Selected Products to Category
              </button>
            </div>
          </form>
          <button onClick={getAllProductsNotInCategory}>Get products not in this category button</button>
        </div>
      </div>
    </div>
    
  );
};

export default AddProductToCategory;
