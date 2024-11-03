import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoIosClose } from 'react-icons/io';
import imageConfig from '../config/imageConfig';
import { IoMdArrowDropdown } from "react-icons/io";
import { useLogin } from '../context/LoginContext';


const SideMenu = ({ isOpen, onClose }) => {
  const { logout, auth, isLoggedIn, showLogin } = useLogin(); // Correct the variable name here
    const [currency, setCurrency] = useState("USD");
    const handleCurrencyChange = (event) => {
        setCurrency(event.target.value);
      };

      const onSuccess = () => {
        onClose();
      }


      const currencies = [
        { code: "USD", label: "USD", flag: imageConfig.flags.usa },
        { code: "GBP", label: "GBP", flag: imageConfig.flags.gb },
      ];
    
      const selectedCurrency = currencies.find((cur) => cur.code === currency);
  return (
    <>
        {isOpen ? <div className="fixed top-0 z-10 inset-0 bg-black opacity-50 w-full h-screen" onClick={onClose} /> : (null)}
    <div
      className={`fixed top-0 left-0 z-50 w-[250px] h-full bg-white shadow-lg transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out`}
    >

      <button
        className="absolute top-5 right-5 text-3xl text-gray-700"
        onClick={onClose}
      >
        <IoIosClose />
      </button>
      <nav className="mt-20">
        <ul className="space-y-4 text-lg text-gray-700">
          <li>
            <Link to="/" className="block px-4 py-2 hover:bg-gray-100" onClick={onClose}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/products/search" className="block px-4 py-2 hover:bg-gray-100" onClick={onClose}>
              Search
            </Link>
          </li>
          <li>
            <Link to="/cart" className="block px-4 py-2 hover:bg-gray-100" onClick={onClose}>
              Cart
            </Link>
          </li>
          <li>
            <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100" onClick={onClose}>
              Profile
            </Link>
          </li>
          <li>
          {isLoggedIn ? (
            <li>
              <button
                className="block px-4 py-2 hover:bg-gray-100 w-full"
                onClick={logout} // Call logout when the user is logged in
              >
                Logout
              </button>
            </li>
          ) : (
            <li>
              <button
                className="block px-4 py-2 hover:bg-gray-100 w-full"
                onClick={() => showLogin(onSuccess)} // Show login when the user is not logged in
              >
                Login
              </button>
            </li>
          )}

          </li>
        </ul>
        <div className="relative flex items-center border border-gray-300 rounded px-2 w-max mx-auto my-5">
            <img
              src={selectedCurrency.flag}
              alt={selectedCurrency.code}
              className="h-[15px] mr-2 rounded-[0]"
            />
            <select
              value={currency}
              onChange={handleCurrencyChange}
              className=" text-black bg-white pr-auto px-1"
            >
              {currencies.map((cur) => (
                <option key={cur.code} value={cur.code}>
                  {cur.label}
                </option>
              ))}
            </select>
            {/* <IoMdArrowDropdown className="text-black text-xl ml-1" /> */}
          </div>
      </nav>
    </div>
    </>
  );
};

export default SideMenu;
