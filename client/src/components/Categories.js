import React from "react";
import AdminSideBar from "./AdminSideBar";
import AddProductToCategory from "./AddProductToCategory";
import CreateCategory from "./CreateCategory";

const Categories = () => {
  return (
    <div className="flex flex-row">
      <AdminSideBar />
      <div>
        <CreateCategory />
        <AddProductToCategory />
      </div>
    </div>
  );
};

export default Categories;
