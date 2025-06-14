import React, { useState, useEffect } from "react";
import { IoIosCart } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import imageConfig from "../config/imageConfig";
import SideMenu from "./SideMenu"; // Import the SideMenu component'
import { useCart } from "../context/CartContext";
import ProfileMenu from "./ProfileMenu";
import { useLogin } from "../context/LoginContext";

const NavBar = (props) => {
  const {isLoggedIn, showLogin} = useLogin();
  const navigate = useNavigate();
  const [currency, setCurrency] = useState("USD");
  const [bgColor, setBgColor] = useState("transparent");
  const [cartQuantity, setCartQuantity] = useState(0);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false); // State to control the side menu
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // State to control the side menu
  const { quantity, fetchCartItems } = useCart();

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  useEffect(() => {
    fetchCartItems();
  }, [])

  useEffect(() => {
    fetchCartItems();

  }, [isLoggedIn])

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
        className={`navbar md:px-[40px] px-[20px] z-50 w-full h-[80px] flex items-center justify-between top-0 left-0 relative shadow-md ${bgColor === 'white' ? 'bg-white' : 'bg-' + bgColor + '-500'}`}
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

        <section className="section_middle absolute left-1/2 hover:cursor-pointer transform -translate-x-1/2 flex items-center text-[20px] sm:text-[40px]"
          onClick={() => navigate('/')}
        >
          <h1 className="m-0">RIMAS</h1>
          <img
            className="sm:h-[60px] h-[30px] md:mx-2 mx-[2px]"
            src="/images/diamond.png"
            alt="Diamond Logo"
          />
          <h1 className="m-0">STORE</h1>
        </section>

        <section className="section_right flex items-center text-gray-700 md:gap-5 gap-0">
          {isLoggedIn ? (null) : 
          <button className="text-gray-600 md:text-[15px] text-[11px] md:block hidden"
          onClick={() => showLogin()}>
            Sign in
          </button>}

          <Link to={`/cart`} className="flex">
            <IoIosCart className="sm:text-[33px] text-[25px]  transition duration-300 hover:text-red hover:scale-105" />
            <div className="h-5 flex font-medium items-center justify-center w-5 rounded-[50px] bg-red-400 text-white">{quantity}</div>
          </Link>
          {/* <Link to={`/profile`}>
            <FaUser className="sm:text-[30px] text-[23px] transition duration-300 hover:text-red hover:scale-105" />
          </Link> */}
          <button className="flex flex-col gap-2 hidden md:flex" onClick={toggleProfileMenu}>
            <div className="w-[25px] h-[1px] bg-black" />
            <div className="w-[25px] h-[1px] bg-black" />
            <div className="w-[25px] h-[1px] bg-black" />
          </button>

          {/* <div className="relative hidden sm:flex items-center border border-gray-300 rounded px-2">
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
          </div> */}
        </section>
      </nav>

      {/* Include the SideMenu component */}
      <SideMenu isOpen={isSideMenuOpen} onClose={toggleSideMenu} />
      <ProfileMenu isOpen={isProfileMenuOpen} onClose={toggleProfileMenu} />

    </>
  );
};

export default NavBar;
