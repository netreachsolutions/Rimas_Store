import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import NavBar from './NavBar';

const ProductDetails = () => {
  const { id } = useParams();  // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);  // State for quantity

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/users/products/${id}`);
        setProduct(response.data.product);
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
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    }
  };


  if (loading) {
    return <div>Loading...</div>;
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
    <div className="product-details container mx-auto my-8 p-4">
      <div className="flex flex-wrap">
        <div className="w-full md:w-1/2">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-auto"
          />
        </div>
        <div className="w-full md:w-1/2 p-4 flex flex-col">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-lg text-gray-700 mb-4">{product.description}</p>
          <p className="text-2xl font-bold mb-4">${product.price}</p>
          <p className="text-lg font-medium text-gray-600">Stock: {product.stock}</p>

          <div className="flex items-center space-x-4">
            <label htmlFor="quantity" className="text-lg font-medium">Quantity:</label>
            <input 
              type="number" 
              id="quantity" 
              name="quantity" 
              min="1" 
              max={product.stock} 
              value={quantity} 
              onChange={handleQuantityChange} 
              className="border rounded px-2 py-1 w-20"
            />
          </div>

          <button  onClick={handleAddToCart} className="bg-black text-white py-2 px-4 mt-4 hover:bg-red transition duration-300">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductDetails;
