import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import NavBar from "./NavBar";
import imageConfig from '../config/imageConfig';
import Typing from 'react-typing-effect';
import Footer from "./Footer";

const Home = () => {
  const [products, setProducts] = useState([]);
  const brands = [
    {
      english: 'Altamode',
      arabic: 'التمودة',
      image_url: imageConfig.brands.altamode
    },
    {
      english: 'Ratti',
      arabic: 'راتي',
      image_url: imageConfig.brands.ratti
    },
    {
      english: 'Total English',
      arabic: 'توتال إنجليش',
      image_url: imageConfig.brands.altamode
    }
  ];

  // Fetch products from the server
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('api/users/products');
        setProducts(response.data.products);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <NavBar className="z-50" />
      <div className="relative hero h-screen w-full flex flex-col">
        <img
          src={imageConfig.homeScreenBackground} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-row items-center justify-center z-10">
          <div className="md:text-[65px] text-[55px] text-black text-center px-2 py-2 md:bg-white md:bg-opacity-10 md:backdrop-blur">
            <Typing
              text="Elevate your wardrobe, elevate your life."
              speed={100}
              eraseDelay={2000}
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent backdrop-blur-[0] to-white z-2"></div>
      </div>

      <div className="flex flex-col w-full items-center py-10">
        <h1 className="text-[30px]">Our Brands</h1>
        <p className="text-lg font-light text-center md:max-w-[800px] max-w-[89%]">
          We bring you the best brands that embody quality, innovation, and style.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 m-auto bg-[#F6F5F8] px-[10px] py-[30px] pr-[20px] mb-[40px]">
      {brands.map((brand, index) => (
  <div key={index} className="relative w-full h-[300px] pb-[100%] flex items-center justify-center bg-gray-200 rounded-[50px] overflow-hidden">
    <img
      src={brand.image_url}
      className="absolute top-0 left-0 w-full h-full object-cover"
      alt={`${brand.english} | ${brand.arabic}`}
      style={{ objectPosition: "top center" }}
    />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 backdrop-blur-[0] to-transparent z-2"></div>

    <h1 className="text-white text-[35px] md:[40px] font-bold text-center absolute bottom-5 z-10">
      {brand.english} | {brand.arabic}
    </h1>
  </div>
))}

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 m-auto bg-[#F6F5F8] px-[10px] py-[30px] pr-[20px] mb-[40px]">
        {products.map((product, index) => (
          <div key={index} className="flex flex-col">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-auto"
            />
            <div className="price-section mt-4">
              <h4 className="lg:text-[20px] sm:text-[22px] text-[18px] font-primary uppercase font-bold text-black">
                {product.name}
              </h4>
              <p className="font-primary font-medium text-red">
                ${product.price}
              </p>
              <Link to={`/products/${product.product_id}`} state={{ product: product }}>
                <button className="uppercase font-primary w-full block py-2 font-medium mt-3 text-white bg-black transition duration-300 hover:bg-red hover:scale-105">
                  <span className="flex items-center justify-center">
                    add to cart
                  </span>
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      <Footer/>
    </>
  );
};

export default Home;
