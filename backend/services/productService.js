// services/userService.js
const { 
  getAllProductsWithImage, 
  getAllActiveProductsWithImage,
  createProduct,
  createProductImage,
  findProductByIdWithImages,
  findProductImages,
  getProductsByCategoryId,
  getProductsByCategoryIdsAndPriceRange,
  createProductImages,
  findProductSizes,
  updateProductStock,
  updateProductsActiveStatus
 } = require('../models/productModel');

 const {
  setProductCategories
 } = require('../models/categoryModel');
const { reject } = require('bcrypt/promises');
const { resolve } = require('path');

class ProductService {
  static async allProducts(db) {
    return new Promise((resolve, reject) => {
      getAllProductsWithImage(async (err, results) => {
            if (err) return reject(err);
    
            const products = results;
            // console.log(products)
            resolve({ products });
          });
    });
  };

  static async findProductById(productId) {
    return new Promise((resolve, reject) => {
      findProductByIdWithImages(productId, (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results.length === 0) {
          return resolve(null); // Product not found
        }
        const productData = results[0]
        findProductSizes(productId, (err, sizeResults)=> {
          if (err) {
            return reject(err);
          }
          console.log(sizeResults)
          productData.sizes = sizeResults;
          findProductImages(productId, (err, imageResults) => {
            if (err) {
              return reject(err);
            }
            productData.images = imageResults;
            console.log(productData.images)
            console.log(imageResults)
            resolve(productData);
          });
        })
        // resolve(results[0]); // Return the first product (since we are querying by ID, there should only be one)
      });
    });
  }

  static async newProduct(productData) {
    const { name, description, price, weight, stock, uploadedImageUrls, categories, product_type_id } = productData;

    console.log(uploadedImageUrls);

    return new Promise((resolve, reject) => {
        // First, create the product
        createProduct({ name, description, price, weight, stock, product_type_id }, (err, result) => {
            if (err) {
                console.error('Error creating product:', err);
                return reject(err); // Reject if there's an error creating the product
            }

            const productId = result.insertId; // Get the newly created product ID
            console.log(`Product created with ID: ${productId}`);

            // Now, create the product images using the product ID
            createProductImages(productId, uploadedImageUrls, (err, imageResult) => {
                if (err) {
                    console.error('Error creating product images:', err);
                    return reject(err); // Reject if there's an error creating the product image
                }
                console.log('Product images created');

                // Now, set the product categories
                setProductCategories(productId, categories, (err, result) => {
                    if (err) {
                        console.error('Error creating product categories:', err);
                        return reject(err); // Reject if there's an error creating the product categories
                    }
                    console.log('Created categories');

                    // Only resolve the promise when everything is done
                    resolve({
                        productId,
                        message: 'Product, images, and categories created successfully',
                    });

                    console.log('Promise resolved'); // This should now log
                });
            });
        });
    });
}


  

  static async getProductsByCategory(categoryId) {
    return new Promise((resolve, reject) => {
        getProductsByCategoryId(categoryId, (err, products) => {
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
  console.log(filters)
  return new Promise((resolve, reject) => {
    if (categoryIds.length == 0) {
      getAllActiveProductsWithImage((err, allActiveProducts) => {
        if (err) {
          return reject(err);
        }
        resolve(allActiveProducts);
      })
    } else {

      getProductsByCategoryIdsAndPriceRange(db, categoryIds, minPrice, maxPrice, (err, products) => {
        if (err) {
          return reject(err);
        }
        console.log('products:')
        console.log(products)
        resolve(products);
      });
    }
  });
}

static async updateStock(cartItems) {
  return new Promise((resolve, reject) => {
    updateProductStock(cartItems, (err, result) => {
      if (err) {
        return reject(err);
      }

      resolve('updated succesfully')
    })
  })
}
static async updateProductStatuses(productIds, isActive) {
  return new Promise((resolve, reject) => {
    
    updateProductsActiveStatus(productIds, isActive, (err, result) => {
      if (err) {
        return reject(err);
      }
      
      resolve('updates statuses!')
    })

  })
}

}

module.exports = ProductService;
