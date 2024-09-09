// services/userService.js
const { 
  getAllProductsWithImage, 
  createProduct,
  createProductImage,
  findProductByIdWithImages,
  getProductsByCategoryId,
  getProductsByCategoryIdsAndPriceRange
 } = require('../models/productModel');

 const {
  setProductCategories
 } = require('../models/categoryModel');

class ProductService {
  static async allProducts(db) {
    return new Promise((resolve, reject) => {
      getAllProductsWithImage(db, async (err, results) => {
            if (err) return reject(err);
    
            const products = results;
            // console.log(products)
            resolve({ products });
          });
    });
  };

  static async findProductById(db, productId) {
    return new Promise((resolve, reject) => {
      findProductByIdWithImages(db, productId, (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results.length === 0) {
          return resolve(null); // Product not found
        }
        resolve(results[0]); // Return the first product (since we are querying by ID, there should only be one)
      });
    });
  }

  static async newProduct(db, productData) {
    const { name, description, price, stock, imageUrl, categories } = productData;
  
    return new Promise((resolve, reject) => {
      // First, create the product
      createProduct(db, { name, description, price, stock }, (err, result) => {
        if (err) {
          console.error('Error creating product:', err);
          return reject(err); // Reject if there's an error creating the product
        }
  
        const productId = result.insertId; // Get the newly created product ID
        console.log(`Product created with ID: ${productId}`);
  
        // Now, create the product image using the product ID
        createProductImage(db, { productId, imageUrl }, (err, imageResult) => {
          if (err) {
            console.error('Error creating product image:', err);
            return reject(err); // Reject if there's an error creating the product image
          }
  


          setProductCategories(db, productId, categories, (err, result) => {
            if (err) {
              console.error('Error creating product image:', err);
              return reject(err); // Reject if there's an error creating the product image
            }
          });
          // Resolve the promise after both product and image are successfully created
          resolve({
            productId,
            message: 'Product and image created successfully',
          });
        });
      });
    });
  }

  static async getProductsByCategory(db, categoryId) {
    return new Promise((resolve, reject) => {
        getProductsByCategoryId(db, categoryId, (err, products) => {
            if (err) {
                return reject(err);
            }
            console.log(products)
            resolve(products);
        });
    });

  }
// The calling function in your service/controller
static async getProductsWithFilters(db, filters) {
  console.log(filters);
  const { categoryIds, minPrice, maxPrice } = filters;
  return new Promise((resolve, reject) => {
    getProductsByCategoryIdsAndPriceRange(db, categoryIds, minPrice, maxPrice, (err, products) => {
      if (err) {
        return reject(err);
      }
      console.log('products:')
      console.log(products)
      resolve(products);
    });
  });
}

}

module.exports = ProductService;
