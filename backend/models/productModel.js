// models/productModel.js
const { queryDatabase } = require('../config/pool');


const createProduct = (db, productData, callback) => {
    const { name, description, price, weight, stock, product_type_id } = productData;
    const query = 'INSERT INTO products (name, description, price, product_weight, stock, product_type_id) VALUES (?, ?, ?, ?, ?, ?)';
    // db.query(query, [name, description, price, weight, stock, product_type_id], callback);
    queryDatabase(query, [name, description, price, weight, stock, product_type_id], (err, results) => {
      if (err) return callback(err, null);  // Pass error to callback
      callback(null, results);              // Pass results to callback
    });
  };
  
  const findProductById = (db, productId, callback) => {
    const query = 'SELECT * FROM products WHERE product_id = ?';
    // db.query(query, [productId], callback);
    queryDatabase(query, [productId], (err, results) => {
      if (err) return callback(err, null);  // Pass error to callback
      callback(null, results);              // Pass results to callback
    });
  };

  const findProductByIdWithImages = (db, productId, callback) => {
    const query = `
      SELECT products.*, product_image.image_url 
      FROM products 
      LEFT JOIN product_image ON products.product_id = product_image.product_id 
      WHERE products.product_id = ?
      ORDER BY product_image.priority DESC LIMIT 1;
    `;
    // db.query(query, [productId], callback);
    queryDatabase(query, [productId], (err, results) => {
      if (err) return callback(err, null);  // Pass error to callback
      callback(null, results);              // Pass results to callback
    });
  };

  const getAllProducts = (db, callback) => {
    const query = 'SELECT * FROM products WHERE is_active = TRUE';
    db.query(query, callback);
    queryDatabase(query, [], (err, results) => {
      if (err) return callback(err, null);  // Pass error to callback
      callback(null, results);              // Pass results to callback
    });
  };

  const getAllProductsWithImage = async (db, callback) => {
    const query = 'SELECT products.product_id, products.name, products.description, products.is_active, products.price, products.stock, product_image.image_url FROM products LEFT JOIN product_image ON products.product_id = product_image.product_id AND (product_image.priority = (SELECT MAX(COALESCE(priority, -1)) FROM product_image WHERE product_image.product_id = products.product_id) OR (product_image.priority IS NULL AND NOT EXISTS (SELECT 1 FROM product_image WHERE product_image.product_id = products.product_id AND product_image.priority IS NOT NULL)));';
    // Use queryDatabase and pass in a callback
    queryDatabase(query, [], (err, results) => {
      if (err) return callback(err, null);  // Pass error to callback
      callback(null, results);              // Pass results to callback
    });
  };

 const createProductImage = (db, imageData, callback) => {
    const {productId, imageUrl} = imageData;
    const query = 'INSERT INTO product_image (product_id, image_url) VALUES (?, ?)';
    // db.query(query, [productId, imageUrl], callback)
    queryDatabase(query, [productId, imageUrl], (err, results) => {
      if (err) return callback(err, null);  // Pass error to callback
      callback(null, results);              // Pass results to callback
    });
 }
  
 const getProductsByCategoryId = (db, categoryId, callback) => {
  console.log(categoryId)
  const query = `
SELECT 
    p.product_id, 
    p.name, 
    p.description, 
    p.price, 
    p.stock, 
    p.created_at, 
    pi.image_url
FROM 
    products p
INNER JOIN 
    product_category pc ON p.product_id = pc.product_id
INNER JOIN 
    categories c ON pc.category_id = c.category_id
LEFT JOIN 
    product_image pi ON p.product_id = pi.product_id
WHERE 
    c.category_id = ?
ORDER BY 
    pi.priority IS NULL,  -- Orders rows with NULL priority last
    pi.priority DESC, 
    pi.image_url ASC
;

  `;
  // db.query(query, [categoryId], callback);
  queryDatabase(query, [categoryId], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
};

const getProductsByCategoryIdsAndPriceRange = (db, categoryIds, minPrice, maxPrice, callback) => {
  let query = `
    SELECT 
        DISTINCT p.product_id, 
        p.name, 
        p.description, 
        p.price, 
        p.stock, 
        p.created_at, 
        pi.image_url
    FROM 
        products p
    LEFT JOIN 
        product_category pc ON p.product_id = pc.product_id
    LEFT JOIN 
        categories c ON pc.category_id = c.category_id
    LEFT JOIN 
        product_image pi ON p.product_id = pi.product_id
    WHERE 1 = 1`; // Always true, makes adding conditions easier

  const queryParams = [];

  if (categoryIds && categoryIds.length > 0) {
    query += ` AND p.product_id IN (
      SELECT product_id FROM product_category WHERE category_id IN (?) GROUP BY product_id HAVING COUNT(DISTINCT category_id) = ?
    )`;
    queryParams.push(categoryIds, categoryIds.length);
  }

  if (minPrice !== null) {
    query += ` AND p.price >= ?`;
    queryParams.push(minPrice);
  }

  if (maxPrice !== null) {
    query += ` AND p.price <= ?`;
    queryParams.push(maxPrice);
  }

  query += `
    ORDER BY 
        pi.priority IS NULL,  -- Orders rows with NULL priority last
        pi.priority DESC, 
        pi.image_url ASC;
  `;

  console.log(queryParams);  // Log parameters for debugging
  console.log(query);         // Log query for debugging

  // db.query(query, queryParams, callback);
  queryDatabase(query, queryParams, (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
};



  module.exports = {
    createProduct,
    findProductById,
    getAllProducts,
    createProductImage,
    getAllProductsWithImage,
    findProductByIdWithImages,
    getProductsByCategoryId,
    getProductsByCategoryIdsAndPriceRange
  };
  