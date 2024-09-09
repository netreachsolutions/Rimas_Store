import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoIosClose } from 'react-icons/io';
import imageConfig from '../config/imageConfig';
import { IoMdArrowDropdown } from "react-icons/io";


const SideMenu = ({ isOpen, onClose }) => {
    const [currency, setCurrency] = useState("USD");
    const handleCurrencyChange = (event) => {
        setCurrency(event.target.value);
      };

      const currencies = [
        { code: "USD", label: "USD", flag: imageConfig.flags.usa },
        { code: "GBP", label: "GBP", flag: imageConfig.flags.gb },
      ];
    
      const selectedCurrency = currencies.find((cur) => cur.code === currency);
  return (
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
  );
};

export default SideMenu;
