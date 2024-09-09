import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import AdminSideBar from "./AdminSideBar";
import { Link } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";
import AddProductToCategory from "./AddProductToCategory";
import CreateCategory from "./CreateCategory";

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // const [selectedCategories, setSelectedCategories] = useState([])
  const token = localStorage.getItem("token");
  
  useEffect(()=>{
    const fetchCategoriesWithCount = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/category/categoriesWithCount', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching categories with count');
        setLoading(false);
      }
    }

    fetchCategoriesWithCount();
  ;},[categories])

  // NOTE: NOT NEEDED BUT LOGIC CAN BE USED FOR PRODUCT SELECTION
  // // Handle product checkbox selection
  // const handleCategorySelection = (categoryId) => {
  //   setSelectedCategories((prevSelectedCategories) => {
  //     if (prevSelectedCategories.includes(categoryId)) {
  //       // Remove categoryId from selectedCategories
  //       return prevSelectedCategories.filter((id) => id !== categoryId);
  //     } else {
  //       // Add categoryId to selectedCategories
  //       return [...prevSelectedCategories, categoryId];
  //     }
  //   });
  // };

  // const handleDeletingCategories = async (e) => {
  //   e.preventDefault();

  //   console.log("Selected categories: ", selectedCategories);

  //   if (selectedCategories.length === 0) {
  //     alert("Please select at least one product.");
  //     return;
  //   }

  //   try {
  //     const response = await axios.delete(
  //       "/api/category/deleteCategories",
  //       {
  //         data:{selectedCategories},
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     alert(response.data.message);
  //   } catch (error) {
  //     console.error("Error deleting categories:", error);
  //     alert("Failed to delete categories.");
  //   }
  // }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-row">
      <AdminSideBar />

      <div className="container mx-auto my-8 p-4 flex-grow ml-64">
      <Link to={'./create'}>
      <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2" >
              CREATE NEW
          </button>
      </Link>
        <table className="table-auto w-full border-collapse mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Number of items</th>
              <th className="border px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => { 
              
              return (
                <React.Fragment key={category.category_id}>
                  <tr className="h-20">
                    <td className="border px-4 py-2 text-center">
                      <Link to={"./"+category.category_id}>{category.category_name}</Link>
                      </td>
                    <td className="border px-4 py-2 text-center">{category.description}</td>
                    <td className="border px-4 py-2 text-center">{category.product_count}</td>
                    <td className="border px-4 py-2 text-center">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2">
                      <Link to={"./"+category.category_id}><FaPencilAlt className="text-4xl"/></Link>
                    </button>

                    </td>
                  </tr>
                </React.Fragment>
                  )
                }
              )
            }
            </tbody>
        </table>
        {/* <div className="flex flex-row justify-between px-10">
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mr-2" onClick={handleDeletingCategories}>
              CONFIRM DELETE
          </button>
        </div> */}
      </div>

        {/* <CreateCategory />
        <AddProductToCategory /> */}
      
    </div>
    );
};

export default Categories;
