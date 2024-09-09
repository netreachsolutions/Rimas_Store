import React, { useEffect, useState } from "react";
import axios from "../api/axios";

const Filter = () => {
  const [categoriesByType, setCategoriesByType] = useState({});
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState('');

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

  const handleCategoryClick = (category) => {
    setSelectedCategories((prevSelected) => {
      // Toggle category selection
      if (prevSelected.some((selected) => selected.category_id === category.category_id)) {
        return prevSelected.filter((selected) => selected.category_id !== category.category_id);
      } else {
        return [...prevSelected, category];
      }
    });
  };

  const renderCategoryList = (categories) => (
    <ul className="space-y-2 font-medium">
      {categories.map((category) => (
        <li key={category.category_id}>
          <div
            onClick={() => handleCategoryClick(category)}
            className={`flex items-center p-2 text-[13px] text-gray-900 rounded-lg dark:text-black-300 hover:bg-gray-200 group cursor-pointer ${
              selectedCategories.some((selected) => selected.category_id === category.category_id)
                ? 'bg-gray-200'
                : ''
            }`}
          >
            <input
              type="checkbox"
              checked={selectedCategories.some((selected) => selected.category_id === category.category_id)}
              onChange={() => handleCategoryClick(category)}
              className="mr-2"
            />
            <span className="ml-5">{category.category_name}</span>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      id="logo-sidebar"
      className="fixed top-[80px] left-0 z-20 w-64 h-screen bg-gray-50 border-r border-gray-200  dark:border-gray-700 flex flex-col"
      aria-label="Sidebar"
    >
      <div className="flex-1 px-3 py-4 overflow-y-auto ">
        {/* Display selected categories at the top */}
        {selectedCategories.length > 0 && (
          <div className="mb-6">
            <h2 className="text-black-300 text-[15px] text-left font-semibold mb-3">Selected</h2>
            <ul className="space-y-2 font-medium">
              {selectedCategories.map((category) => (
                <li key={category.category_id} className="flex text-[14px] items-center justify-between p-2 bg-blue-100 text-black-300 rounded-lg">
                  <span>{category.category_name}</span>
                  <button
                    onClick={() => handleCategoryClick(category)}
                    className="ml-2 text-red-500"
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
            {/* <div className="line h-[1px] bg-gray-400 my-3" /> */}
          </div>
        )}

        {/* Render categories by type */}
        {Object.keys(categoriesByType).map((categoryType) => (
          <div key={categoryType} className="w-full mb-6">
            <div className="line h-[1px] bg-gray-400 my-3" />
            <h1 className="text-black-300 text-[15px] text-left font-semibold capitalize">
              {categoryType}
            </h1>
            {renderCategoryList(categoriesByType[categoryType])}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center w-[90%] mb-4 m-auto">
        <a href="https://flowbite.com" className="flex items-center ">
          <span className="self-center text-sm font-semibold sm:text-2xl whitespace-nowrap dark:text-black-300">
            RIMAS
          </span>
          <img className="h-8" src="/images/diamond.png" alt="Diamond Logo" />
          <span className="self-center text-sm font-semibold sm:text-2xl whitespace-nowrap dark:text-black-300">
            STORE
          </span>
        </a>
      </div>
    </aside>
  );
};

export default Filter;
