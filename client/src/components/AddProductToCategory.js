import React, { useState, useEffect } from "react";
import axios from "../api/axios"; // Assuming axios is configured

const AddProductToCategory = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const token = localStorage.getItem("token");

  // Fetch categories and products on component mount
  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        const categoryResponse = await axios.get("/api/category", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(categoryResponse.data);

        const productResponse = await axios.get("/api/users/products");
        setProducts(productResponse.data.products);
      } catch (error) {
        console.error("Error fetching categories or products:", error);
      }
    };
    fetchCategoriesAndProducts();
  }, [token]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Selected products: ", selectedProducts);

    if (selectedProducts.length === 0) {
      alert("Please select at least one product.");
      return;
    }

    try {
      const response = await axios.post(
        "/api/category/addProduct",
        {
          productIds: selectedProducts, // Sending array of selected product IDs
          categoryId: selectedCategory,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(response.data.message);
    } catch (error) {
      console.error("Error adding products to category:", error);
      alert("Failed to add products to category.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Products to Category</h1>
      <form onSubmit={handleSubmit}>
        {/* Category Selector */}
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">
            Select Category:
          </label>
          <select
            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>

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
            className="px-6 py-3 bg-blue text-white font-semibold rounded-md shadow hover:bg-blue focus:outline-none focus:ring-2 focus:ring-blue"
          >
            Add Selected Products to Category
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductToCategory;
