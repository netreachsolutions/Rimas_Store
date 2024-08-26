import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";

const Products = () => {
  const [products, setProducts] = useState([]);

  // Fetch products from the server
  useEffect( () => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('api/users/products');
        setProducts(response.data.products);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-5 m-auto bg-[#F6F5F8] px-[10px] py-[30px] pr-[20px] mb-[40px]">
        {products.map((product, index) => (
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
