import React, { useState, useEffect } from 'react';
import axios from '../api/axios'; // Adjust the import based on your project structure
import NavBar from './NavBar';
import { Link } from 'react-router-dom';
import Spinner from './Spinner';

const ProductSearch = () => {
  const [products, setProducts] = useState([]);
  const [gender, setGender] = useState(null);
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [apparel, setApparel] = useState(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categoriesByType, setCategoriesByType] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/category/type');
        setCategoriesByType(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Error fetching categories');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchRelevantProducts = async () => {
      setError('');
      setLoading(true);

      try {
        const response = await axios.post('/api/products/filter', {
          filters: {
            categoryIds: [gender, size, color, apparel].filter(Boolean),
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
  }, [gender, size, color, apparel, minPrice, maxPrice]);

  const handleCategoryClick = (category, setCategory) => {
    setCategory((prev) => (prev === category.category_id ? null : category.category_id));
  };

  const renderCategoryList = (categories, selectedCategory, setCategory) => (
    <ul className="space-y-2 font-medium">
      {categories.map((category) => (
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
      <div className="container mx-auto my-8 p-4">
        <aside
          id="logo-sidebar"
          className="fixed top-[80px] left-0 z-20 w-64 h-screen bg-gray-50 border-r border-gray-200 dark:border-gray-700 flex flex-col"
          aria-label="Sidebar"
        >
          <div className="flex-1 px-3 py-4 overflow-y-auto ">
            {categoriesByType.gender && (
              <div className="w-full mb-6">
                <div className="line h-[1px] bg-gray-400 my-3" />
                <h1 className="text-black-300 text-[15px] text-left font-semibold capitalize">
                  Gender
                </h1>
                {renderCategoryList(categoriesByType.gender, gender, setGender)}
              </div>
            )}
            {categoriesByType.size && (
              <div className="w-full mb-6">
                <div className="line h-[1px] bg-gray-400 my-3" />
                <h1 className="text-black-300 text-[15px] text-left font-semibold capitalize">
                  Size
                </h1>
                {renderCategoryList(categoriesByType.size, size, setSize)}
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
          <div className="font-light w-full flex px-1 justify-between">
            <span>Sort by</span>
            <span className="font-light">{`${products.length} products`}</span>
          </div>

          {loading ? (
            <div className="mt-4">
              <Spinner />
            </div>
          ) : error ? (
            <div className="mt-4 text-red-500">{error}</div>
          ) : (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
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
