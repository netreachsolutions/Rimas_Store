import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axios';
import NavBar from './NavBar';
import Spinner from './Spinner';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

const ProductDetails = () => {
  const { id } = useParams();  // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);  // State for quantity
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/users/products/${id}`);
        setProduct(response.data.product);
        setImages(response.data.product.images);
        console.log(response.data.product);
        console.log(response.data.product.images);
        setLoading(false);
      } catch (error) {
        setError('Error fetching product details');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);

    // Ensure the value stays within the valid range
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    } else if (value > product.stock) {
      setQuantity(product.stock);
    } else {
      setQuantity(1);
    }
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/carts/add', {
        productId: product.product_id,
        quantity,
        price: product.price,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Product added to cart!');
    } catch (error) {
      if (error.response.status == 403) {
        navigate('/login');
      } else {

        alert('Failed to add product to cart');
      }
      console.error('Error adding to cart:', error);
    }
  };


  if (loading) {
    return         <>
    <NavBar />
    <div className="mt-4">
      <Spinner/></div>
    </>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>No product found</div>;
  }

  return (
    <>
    <NavBar/>
    <div className="product-details container mx-auto my-8 p-4 max-w-[1200px]">
      <div className="flex flex-wrap">
        <div className="w-full md:w-1/2 flex flex-col md:flex-row gap-2">
          <img
              src={images[imageIndex].image_url}
              alt={product.name}
              className="flex-grow h-auto shadow-xl md:hidden block"
            />
          <div className='flex flex-row md:flex-col h-[120px] md:h-auto gap-2 md:w-[120px] '>
            {images.map((img, index) => (
              <div className='rounded-lg'>
                <img 
                  className="m-auto h-full w-full  bg-gray-100 flex flex-col items-center justify-center border-2 border-solid border-gray-300 hover:cursor-pointer"
                  src={img.image_url}
                  onClick={() => setImageIndex(index)}
                />
              </div>
            ))}
            <div className='bg-gray-100 h-full'/>

          </div>
            {/* <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              autoplay={{ delay: 2000, disableOnInteraction: false }}
              loop={true}
              className=" h-full w-full !md:hidden bg-black-500"
            >
            {images.map((img, index) => (
                                  <SwiperSlide key={index}>

              <div className='rounded-lg'>
                <img 
                  className="m-auto h-full w-full  bg-gray-100 flex flex-col items-center justify-center border-2 border-solid border-gray-300 hover:cursor-pointer"
                  src={img.image_url}
                  onClick={() => setImageIndex(index)}
                />
              </div>
              </SwiperSlide>

            ))}
          </Swiper> */}
            <img
              src={images[imageIndex].image_url}
              alt={product.name}
              className="flex-grow h-auto shadow-xl hidden md:block"
            />
        </div>
        <div className="w-full md:w-1/2 p-4 flex flex-col items-start md:items-center flex-col">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-lg text-gray-700 mb-4">{product.description}</p>
          <p className="text-2xl font-bold mb-4">${product.price}</p>
          <p className="text-lg font-medium text-gray-600">Stock: {product.stock}</p>

          <div className="flex w-full items-center space-x-4">
            <label htmlFor="quantity" className="text-lg font-medium">Quantity:</label>
            <input 
              type="number" 
              id="quantity" 
              name="quantity" 
              min="1" 
              max={product.stock} 
              value={quantity} 
              onChange={handleQuantityChange} 
              className="border rounded px-2 py-1 flex-grow bg-gray-100"
            />
          </div>

          <button  onClick={handleAddToCart} className="bg-green-600 w-full py-3   text-white py-2 px-4 mt-4 hover:bg-red transition duration-300">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductDetails;
