import React from "react";
import { IoIosCart } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav
      className={`navbar md:px-[40px] px-[20px] z-50 w-full h-[80px] flex items-center justify-between top-0 left-0`}
    >
      {/* <nav class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700"> */}

      <div className="flex flex-row items-center text-[40px] m-auto">
        <h1 className="m-0">RIMAS</h1>
        <img
          className="h-[60px] mx-2"
          src="/images/diamond.png"
          alt="Diamond Logo"
        />
        <h1 className="m-0">STORE</h1>
      </div>
      <div className="flex gap-5">
        <Link to={`/`}>home</Link>

        <Link to={`/cart`}>
          <IoIosCart className="text-[33px] text-black transition duration-300 hover:text-red hover:scale-105" />
        </Link>
        <Link to={`/profile`}>
          <FaUser className="text-[30px] text-black transition duration-300 hover:text-red hover:scale-105" />
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
