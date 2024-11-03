import React, { useState, useEffect } from 'react';
import axios from '../api/axios'; // Adjust the import based on your project structure
import NavBar from './NavBar';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Spinner from './Spinner';
import imageConfig from '../config/imageConfig';
import { RxCross2 } from "react-icons/rx";
import { FaFilter } from "react-icons/fa6";
import { IoIosClose } from 'react-icons/io';





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
    'brand': {
      next: 'width',
      items: [
        {
          id: 20,
          english: 'Altamode',
          arabic: 'التمودة',
          image_url: imageConfig.brands.altamode
        },
        {
          id: 20, // CHANGE AFTER CATEGORY CREATION
          english: 'Ratti',
          arabic: 'راتي',
          image_url: imageConfig.brands.ratti
        },
        {
          id: 19,
          english: 'English',
          arabic: 'إنجليش',
          image_url: imageConfig.brands.altamode
        },
        {
          id: 18,
          english: 'Italian',
          arabic: 'ايطالي',
          image_url: imageConfig.brands.italian
        }
      ]
    },
    'width': {
      next: 'finish',
      items: [
        {
          id: 23,
          english: 'Rabit',
          arabic: 'التمودة',
          image_url: imageConfig.width.rabit
        },
        {
          id: 24,
          english: 'Kamel',
          arabic: 'راتي',
          image_url: imageConfig.width.kamel
        }
      ]
    },
    'finish': {
      next: null,
      items: [
        {
          id: 21,
          english: 'Lame',
          arabic: 'التمودة',
          image_url: imageConfig.finish.lame
        },
        {
          id: 22,
          english: 'Normal',
          arabic: 'راتي',
          image_url: imageConfig.finish.normal
        }
      ]
    }
  };

  const updateUrlParams = (categoryIds) => {
    // Update URL with selected category IDs
    setSearchParams({ categoryIds: categoryIds.join(',') });
  };

  const featuredItemClick = (feature, next) => {
    setSelectedCategories((prevSelected) => {
      // If the category isn't already selected, add it
      if (!prevSelected.some((selected) => selected.category_id === feature.id)) {
        const updatedCategories = [...prevSelected, { category_id: feature.id, category_name: feature.english }];
        updateUrlParams(updatedCategories.map((category) => category.category_id)); // Update URL
        return updatedCategories;
      }
      return prevSelected; // If already selected, return the same list
    });
    setSelectedFeature(next);
  };

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/category/type');
        setCategoriesByType(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Error fetching categories');
      }
    };

    const fetchSelectedCategories = async (categoryIds) => {
      try {
        const response = await axios.post('/api/category/select', {categoryIds: categoryIds});
        setSelectedCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Error fetching categories');
      }    }

    // Get category IDs from URL query params (if available) and set as selected categories
    const categoryIdsFromUrl = searchParams.get('categoryIds');
    if (categoryIdsFromUrl) {
      const categoryIdsArray = categoryIdsFromUrl.split(',').map(Number);
      fetchSelectedCategories(categoryIdsArray);
      // You might need to map these IDs back to their respective category names if necessary
      // (for now we're just using IDs to simplify)
      // setSelectedCategories(categoryIdsArray.map(id => ({ category_id: id, category_name: `Category ${id}` })));
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchRelevantProducts = async () => {
      setError('');
      setLoading(true);

      const selectedCategoryIds = selectedCategories.map((category) => category.category_id);

      try {
        const response = await axios.post('/api/products/filter', {
          filters: {
            categoryIds: selectedCategoryIds.filter(Boolean),
            minPrice: minPrice || null,
            maxPrice: maxPrice || null,
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchRelevantProducts();
  }, [minPrice, maxPrice, selectedCategories]);

  const handleCategoryClick = (category, setCategory) => {
    setCategory((prev) => {
      if (prev === category.category_id) {
        // Deselect the category
        setSelectedCategories((prevSelected) => {
          const updatedCategories = prevSelected.filter((c) => c.category_id !== category.category_id);
          updateUrlParams(updatedCategories.map((c) => c.category_id)); // Update URL
          return updatedCategories;
        });
        return null;
      } else {
        // Add the category to the selectedCategories list
        setSelectedCategories((prevSelected) => {
          if (!prevSelected.some((selected) => selected.category_id === category.category_id)) {
            const updatedCategories = [...prevSelected, category];
            updateUrlParams(updatedCategories.map((c) => c.category_id)); // Update URL
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
      updateUrlParams(updatedCategories.map((c) => c.category_id)); // Update URL
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
        <aside
          id="logo-sidebar"
          className={`fixed top-[80px] left-0 z-20 w-64 h-screen bg-gray-50 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-transform duration-300 ${
            isSidebarVisible ? 'translate-x-0' : 'sm:-translate-x-0 -translate-x-full'  // Toggle sidebar visibility
          }`}
          aria-label="Sidebar"
        >
                <button
        className="absolute top-2 right-3 text-3xl text-gray-700 sm:hidden"
        onClick={() => setIsSidebarVisible(false)} // Corrected: Use arrow function to update state
        >
        <IoIosClose />
      </button>
          <div className="flex-1 px-3 py-4 overflow-y-auto sm:mt-0 mt-3">
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

        <div className="md:ml-64">
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 m-auto  px-[10px] py-[0px]  mb-[0px]"> */}

        {/* <div
          className={`grid m-auto px-[0px] py-[0px] mb-[0px] gap-0`}
          style={{
            gridTemplateColumns: `repeat(${Math.min(featured[selectedFeature]?.items.length, 4)}, 1fr)`,
            height: selectedFeature ? '200px' : '0px', // Fixed height for the grid
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
              <h1 className="text-white text-[20px] md:text-[35px] font-bold text-center absolute bottom-5 z-10">
                {brand.english} | {brand.arabic}
              </h1>
            </button>
          ))}
        </div> */}
        {/* <div className='categories flex gap-1'>
          {selectedCategories.map((category, index) => (
            <div className='bg-gray-100 px-3 py-2 flex gap-1 items-center'>
              {category.category_name}
              <RxCross2  
                className='hover:cursor-pointer mt-[3px]'
                onClick={() => handleRemoveCategory(category)} // Add onClick handler to remove the category
                />
            </div>
          ))}
        </div> */}
        <div className="font-light w-full flex px-1 pt-3 justify-between items-end">
        <div className='categories grid grid-cols-4 gap-1'>
          {selectedCategories.map((category, index) => (
            <div className='bg-gray-100 px-3 py-2 flex gap-1 font-normal items-center sm:text-[18px] text-[15px]'>
              <span>{category.category_name}</span>
              <RxCross2  
                className='hover:cursor-pointer mt-[3px]'
                onClick={() => handleRemoveCategory(category)} // Add onClick handler to remove the category
                />
            </div>
          ))}

        </div>
      </div>
      <div className='flex justify-between items-end sm:justify-end'>
          <div className='px-2 sm:hidden'>{products.length} items</div>
          <div>
            <span className="hidden sm:block font-light">{`${products.length} products`}</span>
            <div className='sm:hidden flex items-end bg-gray-50 rounded px-2 py-1 border justify-between gap-7 font-'
                onClick={() => setIsSidebarVisible(!isSidebarVisible)}>  {/* Toggle sidebar visibility */}
              Filters<FaFilter className='mb-1'/>
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
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link to={`/products/${product.product_id}`} key={product.product_id}>
                  <div className="border p-4 rounded-md shadow hover:shadow-lg transition-shadow h-full">
                    <img
                      src={product.image_url || 'placeholder-image-url'}
                      alt={product.name}
                      className="w-full h-[300px] object-cover mb-4"
                    />
                    <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                    <p className="text-gray-600 mb-2">{product.description}</p>
                    <p className="text-gray-800 font-bold">£{product.price}</p>
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
