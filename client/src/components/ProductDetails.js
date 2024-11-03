import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaCheckCircle } from "react-icons/fa";
import axios from '../api/axios';
import NavBar from './NavBar';
import Spinner from './Spinner';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { useLogin } from '../context/LoginContext';
import { useCart } from '../context/CartContext';
import { useAlert } from '../context/AlertContext';
import AcceptedPaymentMethods from './AcceptedPaymentMethods';

const ProductDetails = () => {
  const { showAlert } = useAlert();
  const { showLogin } = useLogin();
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const navigate = useNavigate();
  const { fetchCartItems } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/users/products/${id}`);
        setProduct(response.data.product);
        setImages(response.data.product.images);
        setSizes(response.data.product.sizes);
        setLoading(false);
      } catch (error) {
        setError('Error fetching product details');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (value) => {
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    } else if (value > product.stock) {
      showAlert('No More Available Stock', 'warning');
      setQuantity(product.stock);
    } else {
      setQuantity(1);
    }
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/carts/add',
        {
          productId: product.product_id,
          quantity,
          price: product.price,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCartItems();
      showAlert('Product added to cart!', 'success');
      setAddedToCart(true);
    } catch (error) {
      if (error.response.status === 403) {
        showLogin();
      } else if (error.response.status === 400) {
        showAlert('Items Not Added (No More Stock Left)');
      } else {
        showAlert('Failed to add product to cart', 'danger');
      }
    }
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="mt-4">
          <Spinner />
        </div>
      </>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>No product found</div>;
  }

  return (
    <div className='z-10'>
      <NavBar />
      <div className="product-details container mx-auto px-[50px] my-8 p-4 max-w-[1200px]">
        <div className="flex flex-col md:gap-8 md:flex-row">
          <div className="w-full md:w-1/2 flex flex-col md:flex-row gap-2">
            <img
              src={images[imageIndex]?.image_url}
              alt={product.name}
              className="flex-grow h-auto shadow-xl md:hidden block"
            />
            <div className='flex flex-grow flex-row md:flex-col h-[120px] md:h-auto gap-2 md:w-[120px]'>
              {images.map((img, index) => (
                <div className='rounded-lg' key={index}>
                  <img
                    className="m-auto h-full w-full bg-gray-100 flex flex-col items-center justify-center border-2 border-solid border-gray-300 hover:cursor-pointer"
                    src={img.image_url}
                    onClick={() => setImageIndex(index)}
                  />
                </div>
              ))}
            </div>
            <img
              src={images[imageIndex].image_url}
              alt={product.name}
              className="w-[80%] shadow-xl hidden md:block"
            />
          </div>

          <div className="w-full md:w-1/2 mt-4 sm:mt-0 sm:p-4 flex flex-col items-start md:items-left flex-col">
            <h1 className="text-3xl text-gray-600 font-medium mb-2 text-left">{product.name}</h1>
            <p className="text-2xl font-bold mb-2">£{product.price}</p>
            <p className="text-lg text-gray-700 sm:mb-4">{product.description}</p>
            <div className='flex mb-3'>
              {sizes.map((category, index) => (
                <button className='border-black bg-gray-50 px-2 py-1 border-[1px]' key={index}>
                  {category.category_name}
                </button>
              ))}
            </div>
            <p className="text-lg font-medium text-gray-600">Stock: {product.stock}</p>

            {product.stock > 0 ? (
              // Show quantity selector and Add to Cart button if stock > 0
              <>
                <div className='flex gap-2 w-full mt-5'>
                  <div className='border-2 border-gray flex items-center text-[35px] md:text-[40px] font-light px-2'>
                    <button className='w-1/3 text-[45px] md:text-[50px]' onClick={() => handleQuantityChange(quantity - 1)}>-</button>
                    <h2 className='md:text-[25px] text-[23px] text-center w-max mx-[15px] flex justify-center translate-x-[1px] translate-y-[2px]'>{quantity}</h2>
                    <button className='w-1/3' onClick={() => handleQuantityChange(quantity + 1)}>+</button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="bg-green-600 w-full py-3 text-white py-2 px-4 hover:bg-green-700 transition duration-300 md:h-full hover:cursor-pointer"
                  >
                    {addedToCart ? 'Add Another to Cart' : 'Add to Cart'}
                  </button>
                </div>
                {/* View Cart Button */}
                {addedToCart && (
                  <Link
                    to="/cart"
                    className="bg-blue-600 w-full py-3 text-white py-2 px-4 mt-4 hover:bg-blue-800 transition duration-300 text-center"
                  >
                    View Cart
                  </Link>
                )}
              </>
            ) : (
              // Show Out of Stock button if stock is 0
              <button
                className="bg-gray-400 text-white w-full py-3 px-4 mt-5 cursor-not-allowed"
                disabled
              >
                OUT OF STOCK
              </button>
            )}
            
            <div className='h-5' />
            <AcceptedPaymentMethods className='w-full h-full mt-10' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
