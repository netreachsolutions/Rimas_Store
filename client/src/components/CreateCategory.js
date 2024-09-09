import React, { useState } from "react";
import axios from "../api/axios";
import AdminSideBar from "./AdminSideBar";
import { Link, useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";

const CreateCategory = () => {
  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
    type: "color", // Default value for categoryType
  });

  const token = localStorage.getItem("token");
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData({ ...categoryData, [name]: value});
  };

  const handleImageChange = (e) => {
    setCategoryData({ ...categoryData, image: e.target.files[0] });
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append("file", categoryData.image);

    try {
      const response = await axios.post("/api/image/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setImageUrl(response.data.imageUrl);
      alert("Image uploaded successfully!");
    } catch (error) {
      alert("Failed to upload image.");
      console.error("Error uploading image:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoryDetails = {
      ...categoryData,
      imageUrl,
    };

    try {
      const response = await axios.post(
        "/api/category/create",
        categoryDetails,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Category created successfully!");
      navigate(`/category/${response.data.insertId}`);
    } catch (error) {
      console.error("Error saving Category:", error);
      alert("Failed to save Category.");
    }
  };

  return (
    <div className="flex">
      <AdminSideBar />

      <div className="mx-auto flex-grow md:ml-64 w-full h-full">
        <Link to="/category">
          <span className="flex gap-1 items-center rounded-xl py-1 px-1.5 bg-gray-50 w-max mt-5 ml-4 text-gray-500">
            <IoArrowBackOutline />
            Back to Categories
          </span>
        </Link>
        <div className="max-w-2xl m-auto mt-10 p-6 bg-white shadow-md rounded-lg">
          <h1 className="text-2xl font-bold text-center mb-6">Create Category</h1>
          <form onSubmit={handleSubmit} className="space-y-6 m-auto">
            <div>
              <label className="block mb-2 text-sm font-medium">Category Type</label>
              <select
                name="type"
                value={categoryData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="color">Color</option>
                <option value="brand">Brand</option>
                <option value="gender">Gender</option>
                <option value="size">Size</option>
                <option value="apparel">Apparel</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Category Name</label>
              <input
                type="text"
                name="name"
                placeholder="Category Name"
                value={categoryData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Upload Image</label>
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full"
              />
              <button
                type="button"
                onClick={handleImageUpload}
                className="mt-4 w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
              >
                Upload Image
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
            >
              Create Category
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCategory;
