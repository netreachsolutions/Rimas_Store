import React, {useState} from "react";
import { Link } from "react-router-dom";
import { IoShirt } from "react-icons/io5";

const AdminSideBarMobile = () => {
    const [isOpen, setIsOpen] = useState(false); // State to toggle sidebar visibility

    const toggleSidebar = () => {
      setIsOpen(!isOpen); // Toggle the sidebar visibility
    };
  return (

     <>
      {/* Hamburger Icon */}
      <div className="fixed top-4 left-4 z-50">
        <section className="md:hidden block">
        <button onClick={toggleSidebar} className="text-gray-500 focus:outline-none flex flex-col gap-2">
            <div className="w-[25px] h-[1px] bg-black" />
            <div className="w-[25px] h-[1px] bg-black" />
            <div className="w-[25px] h-[1px] bg-black" />
          </button>
        </section>
      </div>
    <aside
      id="logo-sidebar"
      className={`fixed top-0 left-0 z-50 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out`}
      aria-label="Sidebar"
    >
      <h5
        id="drawer-navigation-label"
        class="text-base font-semibold text-gray-500 uppercase dark:text-gray-400 absolute top-2.5 start-5"
      >
        Menu
      </h5>

      <button
        type="button"
        data-drawer-hide="drawer-navigation"
        aria-controls="drawer-navigation"
        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
        onClick={toggleSidebar}
      >
        <svg
          aria-hidden="true"
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <span class="sr-only">Close menu</span>
      </button>
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          <li>
            <a
              href="#"
              className="flex items-center text-left p-2 text-gray-900 rounded-lg dark:text-gray-500 group"
            >
              <svg
                className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-500 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 21"
              >
                <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
              </svg>
              <span className="ml-5">Dashboard</span>
            </a>
          </li>
          <li>
            <Link to={"/category"}>
              <a
                href="#"
                className="flex items-center text-left p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 18"
                >
                  <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                </svg>
                <span className="flex-1 ml-5 whitespace-nowrap">
                  Categories
                </span>
                {/* <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span> */}
              </a>
            </Link>
          </li>
          <li>
          <Link to={"/admin/products"}>
            <a
              href="#"
              className="flex items-center text-left p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <IoShirt className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              <span className="flex-1 ml-5 whitespace-nowrap">Products</span>
              {/* <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span> */}
            </a>
            </Link>
          </li>
          {/* <li>
        <a href="#" className="flex items-center text-left p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
           <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z"/>
           </svg>
           <span className="flex-1 ml-5 pl-0 whitespace-nowrap">Inbox</span>
           <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>
        </a>
     </li> */}
          <li>
            <a
              href="#"
              className="flex items-center text-left p-2 text-gray-900 rounded-lg dark:text-gray-500 group"
            >
              <svg
                className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-500 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 18"
              >
                <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
              </svg>
              <span className="flex-1 ml-5 whitespace-nowrap">Customers</span>
            </a>
          </li>
          <li>
            <Link to={"/orders"}>
              <a className="flex items-center text-left p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 20"
                >
                  <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z" />
                </svg>
                <span className="flex-1 ml-5 whitespace-nowrap">Orders</span>
              </a>
            </Link>
          </li>
          <li className="hidden">
            <a
              href="#"
              className="flex items-center text-left p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <svg
                className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 16"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                />
              </svg>
              <span className="flex-1 ml-5 whitespace-nowrap">Sign In</span>
            </a>
          </li>
          <li className="hidden">
            <a
              href="#"
              className="flex items-center text-left p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <svg
                className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z" />
                <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z" />
                <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z" />
              </svg>
              <span className="flex-1 ml-5 whitespace-nowrap">Sign Up</span>
            </a>
          </li>
        </ul>
        <div className="flex items-center justify-center w-[90%] mb-4 m-auto absolute bottom-1 right-3">
          <a href="https://flowbite.com" class="flex items-center ">
            <span class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
              RIMAS
            </span>

            <img className="h-8" src="/images/diamond.png" alt="Diamond Logo" />

            {/* <img src="https://flowbite.com/docs/images/logo.svg" class="h-8 me-3" alt="FlowBite Logo" /> */}
            <span class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
              STORE
            </span>
          </a>
        </div>
      </div>
    </aside>
    </>
  );
};

export default AdminSideBarMobile;




import React, { useState, useEffect } from 'react';
import axios from '../api/axios'; // Adjust the import based on your project structure
import NavBar from './NavBar';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Spinner from './Spinner';
import imageConfig from '../config/imageConfig';
import { RxCross2 } from "react-icons/rx";
import { FaFilter } from "react-icons/fa6";

const ProductSearch = (props) => {
  const [products, setProducts] = useState([]);
  const [gender, setGender] = useState(null);
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [apparel, setApparel] = useState(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categoriesByType, setCategoriesByType] = useState({});
  const [selectedFeature, setSelectedFeature] = useState('brand');
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // Sidebar visibility state

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const featured = {
    // Featured object here...
  };

  const updateUrlParams = (categoryIds) => {
    setSearchParams({ categoryIds: categoryIds.join(',') });
  };

  const featuredItemClick = (feature, next) => {
    setSelectedCategories((prevSelected) => {
      if (!prevSelected.some((selected) => selected.category_id === feature.id)) {
        const updatedCategories = [...prevSelected, { category_id: feature.id, category_name: feature.english }];
        updateUrlParams(updatedCategories.map((category) => category.category_id)); 
        return updatedCategories;
      }
      return prevSelected; 
    });
    setSelectedFeature(next);
  };

  useEffect(() => {
    // Fetch categories and selected categories from URL
  }, []);

  useEffect(() => {
    // Fetch relevant products based on selected filters
  }, [minPrice, maxPrice, selectedCategories]);

  const handleCategoryClick = (category, setCategory) => {
    setCategory((prev) => {
      if (prev === category.category_id) {
        setSelectedCategories((prevSelected) => {
          const updatedCategories = prevSelected.filter((c) => c.category_id !== category.category_id);
          updateUrlParams(updatedCategories.map((c) => c.category_id)); 
          return updatedCategories;
        });
        return null;
      } else {
        setSelectedCategories((prevSelected) => {
          if (!prevSelected.some((selected) => selected.category_id === category.category_id)) {
            const updatedCategories = [...prevSelected, category];
            updateUrlParams(updatedCategories.map((c) => c.category_id)); 
            return updatedCategories;
          }
          return prevSelected;
        });
        return category.category_id;
      }
    });
  };

  const handleRemoveCategory = (categoryToRemove) => {
    setSelectedCategories((prevSelected) => {
      const updatedCategories = prevSelected.filter((category) => category.category_id !== categoryToRemove.category_id);
      updateUrlParams(updatedCategories.map((c) => c.category_id)); 
      return updatedCategories;
    });
  };

  const renderCategoryList = (categories, selectedCategory, setCategory) => (
    <ul className="space-y-2 font-medium">
      {categories.items.map((category) => (
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
      <NavBar background="white" className="z-50 ml-64" />
      <div className="container mx-auto my-1 p-4">
        {/* Sidebar */}
        <aside
          id="logo-sidebar"
          className={`fixed top-[80px] left-0 z-20 w-64 h-screen bg-gray-50 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-transform duration-300 ${
            isSidebarVisible ? 'translate-x-0' : '-translate-x-full'  // Toggle sidebar visibility
          }`}
          aria-label="Sidebar"
        >
          <div className="flex-1 px-3 py-4 overflow-y-auto ">
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
            {categoriesByType['3'] && (
              <div className="w-full mb-6">
                <div className="line h-[1px] bg-gray-400 my-3" />
                <h1 className="text-black-300 text-[15px] text-left font-semibold capitalize">
                  Brand
                </h1>
                {renderCategoryList(categoriesByType['3'], color, setColor)}
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
          </div>
        </aside>

        {/* Main content */}
        <div className="md:ml-64">
          {/* Featured items grid */}
          <div
            className={`grid m-auto px-[0px] py-[0px] mb-[0px] gap-0`}
            style={{
              gridTemplateColumns: `repeat(${Math.min(featured[selectedFeature]?.items.length, 4)}, 1fr)`,
              height: selectedFeature ? '200px' : '0px', 
            }}
          >
            {selectedFeature && featured[selectedFeature]?.items.map((brand, index) => (
              <button
                key={index}
                className="relative h-full flex items-center justify-center bg-gray-200 rounded-[0px] overflow-hidden hover:cursor-pointer group"
                onClick={() => featuredItemClick(brand, featured[selectedFeature].next)}
              >
                <img
                  src={brand.image_url}
                  className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-[120%]"
                  alt={`${brand.english} | ${brand.arabic}`}
                  style={{ objectPosition: "center" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 backdrop-blur-[0] to-transparent z-2"></div>
                <h1 className="text-white text-[35px] md:[40px] font-bold text-center absolute bottom-5 z-10">
                  {brand.english} | {brand.arabic}
                </h1>
              </button>
            ))}
          </div>

          {/* Filter and category section */}
          <div className="font-light w-full flex px-1 pt-3 justify-between items-end">
            <div className='categories flex gap-1'>
              {selectedCategories.map((category, index) => (
                <div className='bg-gray-100 px-3 py-2 flex gap-1 font-normal items-center'>
                  {category.category_name}
                  <RxCross2  
                    className='hover:cursor-pointer mt-[3px]'
                    onClick={() => handleRemoveCategory(category)} 
                  />
                </div>
              ))}
              <div>
                <span className="hidden sm:block font-light">{`${products.length} products`}</span>

                {/* Toggle Filters button */}
                <div className='sm:hidden flex items-end bg-gray-50 rounded px-2 py-1 border justify-between gap-7'
                     onClick={() => setIsSidebarVisible(!isSidebarVisible)}>  {/* Toggle sidebar visibility */}
                  Filters<FaFilter className='mb-1'/>
                </div>
              </div>
            </div>
          </div>

          <div className='h-[1px] bg-gray-300 w-full mt-3 mb-0'/>

          {loading ? (
            <div className="mt-4">
              <Spinner />
            </div>
          ) : error ? (
            <div className="mt-4 text-red-500">{error}</div>
          ) : (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link to={`/products/${product.product_id}`} key={product.product_id}>
                  <div className="border p-4 rounded-md shadow hover:shadow-lg transition-shadow">
                    <img
                      src={product.image_url || 'placeholder-image-url'}
                      alt={product.name}
                      className="w-full h-40 object-cover mb-4"
                    />
                    <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                    <p className="text-gray-600 mb-2">{product.description}</p>
                    <p className="text-gray-800 font-bold">${product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductSearch;

