import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import NavBar from "./NavBar";
import imageConfig from '../config/imageConfig';
import Typing from 'react-typing-effect';
import Footer from "./Footer";
import { FaSearch } from "react-icons/fa";
import TypeForm from "./TypeForm";

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [products, setProducts] = useState([]);
  const [formVisibility, setFormVisibility] = useState(false)
  const brands = [
    {
      id: 20,
      english: 'Altamode',
      arabic: 'التمودة',
      image_url: imageConfig.brands.altamode,
      next: 'finish'
  },
  {
      id: 18,
      english: 'Ratti',
      arabic: 'راتي',
      image_url: imageConfig.brands.ratti,
      next: 'finish'
  },
  {
      id: 19,
      english: 'English',
      arabic: 'إنجليش',
      image_url: imageConfig.brands.altamode,
      next: 'finish'
  },
  {
      id: 27,
      english: 'Switzerland',
      arabic: 'ايطالي',
      image_url: imageConfig.brands.italian,
      next: 'finish'
  },
  {
      id: 26,
      english: 'Sahra',
      arabic: 'ايطالي',
      image_url: imageConfig.brands.italian,
      next: 'width'
  },
  {
      id: 25,
      english: 'Other',
      arabic: 'ايطالي',
      image_url: imageConfig.brands.italian,
      next: 'width'
  }
  ];

  const toggleForm = () => {

  }

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
    setIsLoaded(true)
    fetchProducts();
  }, []);

  return (
    <>
      {
        formVisibility ? (
          <TypeForm className=''/>
        ) : (
          <></>
        )
      }
      <NavBar className="z-50" />
      <div className="relative hero h-screen w-full flex flex-col">
    <img
      src="/images/phone_design_2.png"
      className="sm:hidden w-full h-full object-cover transform translate-x-full opacity-0 transition-all duration-700 ease-out"
      onLoad={(e) => {
        e.currentTarget.classList.remove('translate-x-full', 'opacity-0');
      }}
      alt="Phone Design"
    />

      <div className="w-full h-full hidden sm:flex">
        <img
          src="/images/model_1.png"
          className={`w-full h-full object-cover object-top transition-transform duration-1000 transition-opacity duration-[2000ms] ${
            isLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
          }`}
          alt="Model 1"
        />
        <img
          src="/images/model_2.png"
          className={`w-full h-full object-cover object-top transform -scale-x-100 transition-transform duration-1000 transition-opacity duration-[2000ms] ${
            isLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
          }`}
          alt="Model 2"
        />
      </div>

        {/* <img
          src={imageConfig.homeScreenBackground} 
          className="w-full h-full object-cover"
        /> */}
        <div className="absolute inset-0 flex flex-col gap-10 items-center justify-start sm:justify-center z-10">
          {/* <div className="md:text-[65px] text-[55px] text-black text-center px-2 py-2 md:bg-white md:bg-opacity-10 md:backdrop-blur">
            <Typing
              text="Elevate your wardrobe, elevate your life."
              speed={100}
              eraseDelay={2000}
            />
          </div> */}
        {/* <button 
          className="absolute bottom-[20vh] animate-pulse md:static z-10 flex gap-4 shadow-xl text-[30px] md:text-[50px] bg-white text-black items-center rounded-[50px] px-8 py-4 transition-transform duration-500 ease-in-out hover:scale-[120%]"
          onClick={() => setFormVisibility(true)}>
            <FaSearch/> Find Thobe
          </button> */}
    <button
      className="absolute bottom-[20vh] md:static z-10 flex gap-4 shadow-xl text-[30px] md:text-[50px] bg-white text-black items-center rounded-[50px] px-8 py-4 transition-transform duration-500 ease-in-out hover:scale-110"
      onClick={() => setFormVisibility(true)}
      style={{
        animation: "pulseOpacity 2s ease-in-out infinite",
      }}
    >
      <FaSearch /> Find Thobe
    </button>
        </div>
        {/* <div className="absolute inset-0 bg-gradient-to-t from-transparent backdrop-blur-[0] to-white z-2"></div> */}
      </div>

      <div className="flex flex-col w-full items-center py-10">
        <h1 className="text-[30px]">Our Brands</h1>
        <p className="text-lg font-light text-center md:max-w-[800px] max-w-[89%]">
          We bring you the best brands that embody quality, innovation, and style.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 m-auto bg-[#F6F5F8] px-[10px] py-[30px]  mb-[40px]">
      {brands.map((brand, index) => (
        <Link to={`/products/search?categoryIds=${brand.id}`}>
          <div key={index} className="relative  sm:h-[0px] h-[0px] pb-[100%] flex items-center justify-center bg-gray-200 rounded-[0px] overflow-hidden hover:cursor-pointer group">
            <img
              src={brand.image_url}
              className="absolute top-0 left-0  object-cover transition-transform duration-500 ease-in-out group-hover:scale-[120%] "
              alt={`${brand.english} | ${brand.arabic}`}
              style={{ objectPosition: "top center" }}
            />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 backdrop-blur-[0] to-transparent z-2"></div>

            <h1 className="text-white text-[35px] md:[40px] font-bold text-center absolute bottom-5 z-10">
              {brand.english} | {brand.arabic}
            </h1>
          </div>
        
        </Link>
))}

      </div>

     
      <Footer/>
    </>
  );
};

export default Home;
