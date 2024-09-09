import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import AdminSideBar from "./AdminSideBar";
import { RiLinkM } from "react-icons/ri";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filter, setFilter] = useState("all"); // Initialize filter state

  // Fetch products from the server
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('api/users/products');
        setProducts(response.data.products);
        setFilteredProducts(response.data.products); // Initialize filteredProducts with all products
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

  return (
    <>
      <AdminSideBar/>
      <div className="ml-64">
        
        {/* Tab Bar */}
        <div className="flex justify-between py-0 w-[95%] m-auto border-b-1 mt-8">
          <div>
            <button
              className={`px-4 py-2  ${filter === "all" ? "border-b-4 text-black border-blue-500" : "text-gray-500"}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`px-4  py-2 ${filter === "active" ? "border-b-4 text-black border-blue-500" : "text-gray-500"}`}
              onClick={() => setFilter("active")}
            >
              Active
            </button>
            <button
              className={`px-4  py-2 ${filter === "hidden" ? "border-b-4 text-black border-blue-500" : "text-gray-500"}`}
              onClick={() => setFilter("hidden")}
            >
              Hidden
            </button>

          </div>
          <Link to={'/upload'}>
      <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2" >
              New Product
          </button>
      </Link>
        </div>

        <table className="table-auto w-[95%] m-auto border-collapse">
          <thead>
            <tr className="bg-gray-0 text-left ">
              <th className="border px-0 py-2 w-[100px] font-light"> </th>
              <th className="border px-0 py-2 text-left">Product</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Inventory</th>
              <th className="border px-4 py-2">Sold</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <React.Fragment key={product.product_id}>
                <tr>
                  <td className="border px-4 py-2 text-center flex gap-3 max-w-[100px]">
                    <input type="radio"/>
                    <img className="h-[50px] w-[70px] rounded-md object-cover" style={{ objectPosition: "top center" }} src={product.image_url}/>
                  </td>
                  <td className="border px-0 py-2 text-left">
                    <Link to={`/products/${product.product_id}`}>
                      <div className="flex items-center">
                        <span className="mr-1">{product.name}</span>
                        <RiLinkM className="text-gray-400 text-sm"/>
                      </div>
                    </Link>
                  </td>
                  <td className="border px-4 py-2 text-left">
                      {product.is_active ? (
                        <span className="bg-green-300 text-gray-600 px-2 py-1 rounded-xl">
                          Active
                        </span>
                      ) : (
                        <span className="bg-red-500 text-white px-2 py-1 rounded">
                          Hidden
                        </span>
                      )}
                    </td>               
                    <td className="border px-4 py-2 text-left text-gray-500">{product.stock} in stock</td>
                  <td className="border px-4 py-2 text-left text-gray-500">0 sold</td>
                </tr>
              
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-5 m-auto bg-[#F6F5F8] px-[10px] py-[30px] pr-[20px] mb-[40px] ml-64">
        {filteredProducts.map((product, index) => (
          <div key={index} className="flex flex-col">
            <img
              src={product.image_url} // Use the imageUrl from the database
              alt={product.name}
              className="w-full h-auto"
            />

            <div className="price-section mt-4">
              <h4 className="lg:text-[20px] sm:text-[22px] text-[18px] font-primary uppercase font-bold text-black">
                {product.name}
              </h4>
              <p className="font-primary font-medium text-red ">
                ${product.price}
              </p>
              <Link to={`/checkout`} state={{ product: product }}>
                <button className="uppercase font-primary w-full block py-2 font-medium mt-3  text-white bg-black transition duration-300 hover:bg-red hover:scale-105">
                  <span className="flex items-center justify-center">
                    {" "}
                    buy now{" "}
                  </span>
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Products;
