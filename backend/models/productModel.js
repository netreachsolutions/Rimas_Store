// models/productModel.js

const createProduct = (db, productData, callback) => {
    const { name, description, price, stock } = productData;
    const query = 'INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)';
    db.query(query, [name, description, price, stock], callback);
  };
  
  const findProductById = (db, productId, callback) => {
    const query = 'SELECT * FROM products WHERE product_id = ?';
    db.query(query, [productId], callback);
  };

  const findProductByIdWithImages = (db, productId, callback) => {
    const query = `
      SELECT products.*, product_image.image_url 
      FROM products 
      LEFT JOIN product_image ON products.product_id = product_image.product_id 
      WHERE products.product_id = ?
      ORDER BY product_image.priority DESC LIMIT 1;
    `;
    db.query(query, [productId], callback);
  };

  const getAllProducts = (db, callback) => {
    const query = 'SELECT * FROM products';
    db.query(query, callback);
  };

  const getAllProductsWithImage = (db, callback) => {
    const query = 'SELECT products.product_id, products.name, products.description, products.price, products.stock, product_image.image_url FROM products LEFT JOIN product_image ON products.product_id = product_image.product_id AND (product_image.priority = (SELECT MAX(COALESCE(priority, -1)) FROM product_image WHERE product_image.product_id = products.product_id) OR (product_image.priority IS NULL AND NOT EXISTS (SELECT 1 FROM product_image WHERE product_image.product_id = products.product_id AND product_image.priority IS NOT NULL)));';
    db.query(query, callback);
  };

 const createProductImage = (db, imageData, callback) => {
    const {productId, imageUrl} = imageData;
    const query = 'INSERT INTO product_image (product_id, image_url) VALUES (?, ?)';
    db.query(query, [productId, imageUrl], callback)
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
    c.category_id = 2
ORDER BY 
    pi.priority IS NULL,  -- Orders rows with NULL priority last
    pi.priority DESC, 
    pi.image_url ASC
LIMIT 1;

  `;
  db.query(query, [categoryId], callback);
};


  module.exports = {
    createProduct,
    findProductById,
    getAllProducts,
    createProductImage,
    getAllProductsWithImage,
    findProductByIdWithImages,
    getProductsByCategoryId
  };
  