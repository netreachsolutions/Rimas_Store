import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import AdminSideBar from "./AdminSideBar";
import { RiLinkM } from "react-icons/ri";
import AdminSideBarMobile from "./AdminSideBarMobile";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState([]);  // State for selected products
  const token = localStorage.getItem('token');


  // Fetch products from the server
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('api/users/products');
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on the selected tab
  useEffect(() => {
    let updatedProducts = products;
    if (filter === "active") {
      updatedProducts = products.filter(product => product.is_active);
    } else if (filter === "hidden") {
      updatedProducts = products.filter(product => !product.is_active);
    }
    setFilteredProducts(updatedProducts);
  }, [filter, products]);

  // Toggle product selection
  const toggleProductSelection = (productId) => {
    setSelectedProducts(prevSelected =>
      prevSelected.includes(productId)
        ? prevSelected.filter(id => id !== productId)  // Deselect if already selected
        : [...prevSelected, productId]                 // Select if not already selected
    );
  };

  // Set selected products as active or inactive
  const updateSelectedProductsStatus = async (isActive) => {
    try {
      await axios.post('/api/products/status', {
        productIds: selectedProducts,
        is_active: isActive,
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update local state
      setProducts(products.map(product => 
        selectedProducts.includes(product.product_id)
          ? { ...product, is_active: isActive }
          : product
      ));
      setSelectedProducts([]);  // Clear selected products
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  return (
    <>
      <AdminSideBarMobile />
      <div className="md:ml-64">
        
        {/* Tab Bar */}
        <div className="flex justify-between py-0 w-[95%] m-auto border-b-1 mt-[50px]">
          <div>
            <button
              className={`px-4 py-2 ${filter === "all" ? "border-b-4 text-black border-blue-500" : "text-gray-500"}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`px-4 py-2 ${filter === "active" ? "border-b-4 text-black border-blue-500" : "text-gray-500"}`}
              onClick={() => setFilter("active")}
            >
              Active
            </button>
            <button
              className={`px-4 py-2 ${filter === "hidden" ? "border-b-4 text-black border-blue-500" : "text-gray-500"}`}
              onClick={() => setFilter("hidden")}
            >
              Hidden
            </button>
          </div>
          <Link to={'/upload'}>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2">
              New Product
            </button>
          </Link>
        </div>

        {/* Products Table */}
        <table className="table-auto w-[95%] md:text-[20px] text-[13px] mx-auto border-collapse mb-[80px]">
          <thead>
            <tr className="bg-gray-0 text-left ">
              {/* <th className="border px-0 py-2 w-[100px] font-light"></th> */}
              <th className="border px-0 py-2 text-left">Product</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Inventory</th>
              <th className="border px-4 py-2 sm:block hidden">Sold</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <React.Fragment key={product.product_id}>
                <tr>
                <td className="border px-4 py-2 text-center flex gap-3 sm:max-w-[1000px] max-w-[299px]">
                    <div>
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.product_id)}
                      onChange={() => toggleProductSelection(product.product_id)}
                    />
                     <span className="text-sm text-gray-400">#{product.product_id}</span>
                    </div>
                    <img
                      className="h-[50px] w-[70px] rounded-md object-cover"
                      style={{ objectPosition: "top center" }}
                      src={product.image_url}
                      alt={product.name}
                    />

                    <Link to={`/products/${product.product_id}`}>
                      <div className="flex items-center">
                        <span className="mr-1">{product.name}</span>
                        <RiLinkM className="text-gray-400 text-sm"/>
                      </div>
                    </Link>
                  </td>
                  {/* <td className="border px-4 py-2 text-center flex gap-3 max-w-[100px]">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.product_id)}
                      onChange={() => toggleProductSelection(product.product_id)}
                    />
                    <img
                      className="h-[50px] w-[70px] rounded-md object-cover"
                      style={{ objectPosition: "top center" }}
                      src={product.image_url}
                      alt={product.name}
                    />
                  </td>
                  <td className="border px-0 py-2 text-left">
                    <Link to={`/products/${product.product_id}`}>
                      <div className="flex items-center">
                        <span className="mr-1">{product.name}</span>
                        <RiLinkM className="text-gray-400 text-sm"/>
                      </div>
                    </Link>
                  </td> */}
                  <td className="border px-4 py-2 text-left">
                    {product.is_active ? (
                      <span className="bg-green-300 text-gray-600 px-2 py-1 rounded-xl">Active</span>
                    ) : (
                      <span className="bg-red-500 text-white px-2 py-1 rounded">Hidden</span>
                    )}
                  </td>
                  <td className="border px-4 py-2 text-left text-gray-500">{product.stock} in stock</td>
                  <td className="border px-4 py-2 text-left text-gray-500 sm:block hidden">0 sold</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* Action Bar */}
        {selectedProducts.length > 0 && (
          <div className="fixed bottom-0 left-0 w-full bg-gray-100 p-4 border-t border-gray-300 flex justify-between items-center">
            <div>{selectedProducts.length} Item(s) selected</div>
            <div className="flex gap-4">
              <button
                onClick={() => updateSelectedProductsStatus(true)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Set as Active
              </button>
              <button
                onClick={() => updateSelectedProductsStatus(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Set as Hidden
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Products;
