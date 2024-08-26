// models/categoryModel.js

const createCategory = (db, categoryData, callback) => {
    const { name, description, image_url } = categoryData;
    const query = 'INSERT INTO categories (category_name, description, image_url) VALUES (?, ?, ?);';
    db.query(query, [name, description, image_url], callback);
  };
  
  const findAllCategories = (db, callback) => {
    const query = 'SELECT * FROM categories';
    db.query(query, callback);
  };
  
  const addProductsToCategory = (db, categoryId, productIds, callback) => {
    // Prepare an array to store the SQL values
    const values = [];
  
    // Construct the values array for each productId
    productIds.forEach((productId) => {
      values.push(categoryId, productId);
    });
  
    // Create the SQL query with placeholders for each product
    const placeholders = productIds.map(() => '(?, ?)').join(', ');
    const query = `INSERT INTO product_category (category_id, product_id) VALUES ${placeholders};`;
  
    // Execute the query with the values array
    db.query(query, values, callback);
  };
  
  
  module.exports = {
    createCategory,
    findAllCategories,
    addProductsToCategory,
  };
  