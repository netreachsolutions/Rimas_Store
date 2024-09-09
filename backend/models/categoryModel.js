// models/categoryModel.js

const createCategory = (db, categoryData, callback) => {
  const { name, description, image_url, type } = categoryData;
  const query =
    "INSERT INTO categories (category_name, image_url, type) VALUES (?, ?, ?);";
  db.query(query, [name, image_url, type], callback);
};

const findAllCategories = (db, callback) => {
  const query = "SELECT * FROM categories";
  db.query(query, callback);
};

const findCategoriesByType = (db, type, callback) => {
  const query = "SELECT * FROM categories WHERE type = ?";
  db.query(query, [type], callback);
};

const addProductsToCategory = (db, categoryId, productIds, callback) => {
  // Prepare an array to store the SQL values
  const values = [];

  // Construct the values array for each productId
  productIds.forEach((productId) => {
    values.push(categoryId, productId);
  });

  // Create the SQL query with placeholders for each product
  const placeholders = productIds.map(() => "(?, ?)").join(", ");
  const query = `INSERT INTO product_category (category_id, product_id) VALUES ${placeholders};`;

  // Execute the query with the values array
  db.query(query, values, callback);
};

const getAllCategoriesWithCount = (db,callback) =>{

  const query = "SELECT c.category_id, c.image_url, c.category_name, COUNT(pc.product_id) AS product_count FROM categories c LEFT JOIN product_category pc ON c.category_id = pc.category_id GROUP BY c.category_id, c.image_url,c.category_name;";

  db.query(query, callback);
}

const deleteCategoriesWithProducts = (db, categoryIds, callback) => {
  // Create placeholders for the number of category IDs
  console.log("\ncategory ids:")
  console.log(categoryIds)

  const placeholders = categoryIds.map(() => '?').join(',');

  console.log("in");
  // Start transaction
  db.beginTransaction((err) => {
    if (err) return callback(err);

    // Delete from product_category table
    const deleteProductCategoryQuery = `
      DELETE FROM product_category
      WHERE category_id IN (${placeholders});
    `;
    
    db.query(deleteProductCategoryQuery, categoryIds, (err, results) => {
      if (err) {
        return db.rollback(() => {
          callback(err);
        });
      }

      // Delete from categories table
      const deleteCategoriesQuery = `
        DELETE FROM categories
        WHERE category_id IN (${placeholders});
      `;

      db.query(deleteCategoriesQuery, categoryIds, (err, results) => {
        if (err) {
          return db.rollback(() => {
            callback(err);
          });
        }

        // Commit the transaction
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              callback(err);
            });
          }
          callback(null, results);
        });
      });
    });

  });
};

const getCategoryByID = (db, categoryID, callback)=>{
  const query = `SELECT category_id, category_name, image_url FROM categories WHERE category_id = ${categoryID};`;

  db.query(query, categoryID,callback);
}

const getAllProductsNotInCategory = (db, categoryID, callback) => {
  const query = `
    SELECT p.product_id, p.name, p.price, p.stock, p.created_at
    FROM products p
    LEFT JOIN product_category pc ON p.product_id = pc.product_id AND pc.category_id = ?
    WHERE pc.product_id IS NULL;
  `;

  db.query(query, [categoryID], callback);
};


const deleteSelectedProductsInCategory = (db, categoryID, productIDs, callback)=>{
  const query = `DELETE FROM product_category WHERE category_id = ? AND product_id IN (?);`

  db.query(query, [categoryID, productIDs], callback)
}

const setProductCategories = (db, productId, categoryIds, callback) => {

      // Prepare an array to store the SQL values for inserting new categories
      const values = [];

      // Construct the values array for each categoryId
      categoryIds.forEach((categoryId) => {
        values.push(categoryId, productId);
      });

      // Create the SQL query with placeholders for each category
      const placeholders = categoryIds.map(() => "(?, ?)").join(", ");
      const insertProductCategoriesQuery = `
        INSERT INTO product_category (category_id, product_id) 
        VALUES ${placeholders};
      `;

      // Insert the new categories for the product
      db.query(insertProductCategoriesQuery, values, callback);
    };




module.exports = {
  createCategory,
  findAllCategories,
  addProductsToCategory,
  getAllCategoriesWithCount,
  deleteCategoriesWithProducts,
  getCategoryByID,
  deleteSelectedProductsInCategory,
  getAllProductsNotInCategory,
  findCategoriesByType,
  setProductCategories
};
