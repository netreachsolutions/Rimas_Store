import React, { useState, useEffect } from "react";
import { IoIosCart } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { Link } from "react-router-dom";
import imageConfig from "../config/imageConfig";
import SideMenu from "./SideMenu"; // Import the SideMenu component

const NavBar = (props) => {
  const [currency, setCurrency] = useState("USD");
  const [bgColor, setBgColor] = useState("transparent");
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false); // State to control the side menu

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  useEffect(() => {
    if (props.background) {
      setBgColor(props.background);
    }
  }, [props.background]);

  const currencies = [
    { code: "USD", label: "USD", flag: imageConfig.flags.usa },
    { code: "GBP", label: "GBP", flag: imageConfig.flags.gb },
  ];

  const selectedCurrency = currencies.find((cur) => cur.code === currency);

  return (
    <>
      <nav
        className={`navbar md:px-[40px] px-[20px] z-50 w-full h-[80px] flex items-center justify-between top-0 left-0 relative ${bgColor === 'white' ? 'bg-white' : 'bg-' + bgColor + '-500'}`}
      >
        <section className="md:hidden block">
          <button className="flex flex-col gap-2" onClick={toggleSideMenu}>
            <div className="w-[25px] h-[1px] bg-black" />
            <div className="w-[25px] h-[1px] bg-black" />
            <div className="w-[25px] h-[1px] bg-black" />
          </button>
        </section>

        <section className="section_left items-center gap-20 w-1/3 justify-center hidden md:flex">
          <Link to={`/`}>Home</Link>
          <Link to={`/products/search`}>Search</Link>
        </section>

        <section className="section_middle absolute left-1/2 transform -translate-x-1/2 flex items-center text-[20px] sm:text-[40px]">
          <h1 className="m-0">RIMAS</h1>
          <img
            className="sm:h-[60px] h-[30px] md:mx-2 mx-[2px]"
            src="/images/diamond.png"
            alt="Diamond Logo"
          />
          <h1 className="m-0">STORE</h1>
        </section>

        <section className="section_right flex items-center text-gray-700 md:gap-5 gap-3">
          <Link to={`/cart`}>
            <IoIosCart className="sm:text-[33px] text-[25px]  transition duration-300 hover:text-red hover:scale-105" />
          </Link>
          <Link to={`/profile`}>
            <FaUser className="sm:text-[30px] text-[23px] transition duration-300 hover:text-red hover:scale-105" />
          </Link>
          <div className="relative hidden sm:flex items-center border border-gray-300 rounded px-2">
            <img
              src={selectedCurrency.flag}
              alt={selectedCurrency.code}
              className="h-[15px] mr-2 rounded-[0]"
            />
            <select
              value={currency}
              onChange={handleCurrencyChange}
              className="appearance-none text-black bg-white pr-auto px-1"
            >
              {currencies.map((cur) => (
                <option key={cur.code} value={cur.code}>
                  {cur.label}
                </option>
              ))}
            </select>
            <IoMdArrowDropdown className="text-black text-xl ml-1" />
          </div>
        </section>
      </nav>

      {/* Include the SideMenu component */}
      <SideMenu isOpen={isSideMenuOpen} onClose={toggleSideMenu} />
    </>
  );
};

export default NavBar;
