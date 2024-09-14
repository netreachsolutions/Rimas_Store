// models/categoryModel.js

const { queryDatabase } = require('../config/pool');


const createCategory = (db, categoryData, callback) => {
  const { name, description, image_url, type } = categoryData;
  const query =
    "INSERT INTO categories (category_name, image_url, type) VALUES (?, ?, ?);";
  // db.query(query, [name, image_url, type], callback);
  queryDatabase(query, [name, image_url, type], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
};

const findAllCategories = (db, callback) => {
  const query = "SELECT * FROM categories";
  // db.query(query, callback);
  queryDatabase(query, [], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
};

const findAllCategoriesWithGroupName = (db, callback) => {
  const query = `
    SELECT categories.*, category_groups.group_name, product_type_categories.product_type_id
    FROM category_groups
    JOIN categories ON category_groups.category_group_id = categories.category_group_id
    LEFT JOIN product_type_categories ON category_groups.category_group_id = product_type_categories.category_group_id
  `;
  // db.query(query, callback);
  queryDatabase(query, [], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
};



const findCategoriesByType = (db, type, callback) => {
  const query = "SELECT * FROM categories WHERE type = ?";
  // db.query(query, [type], callback);
  queryDatabase(query, [type], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
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
  // db.query(query, values, callback);
  queryDatabase(query, values, (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
};

const getAllCategoriesWithCount = (db,callback) =>{

  const query = "SELECT c.category_id, c.image_url, c.category_name, COUNT(pc.product_id) AS product_count FROM categories c LEFT JOIN product_category pc ON c.category_id = pc.category_id GROUP BY c.category_id, c.image_url,c.category_name;";

  // db.query(query, callback);
  queryDatabase(query, [], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
}

const deleteCategoriesWithProducts = (db, categoryIDs, callback) => {
  return callback(err, null);
}

// const deleteCategoriesWithProducts = (db, categoryIds, callback) => {
//   // Create placeholders for the number of category IDs
//   console.log("\ncategory ids:")
//   console.log(categoryIds)

//   const placeholders = categoryIds.map(() => '?').join(',');

//   console.log("in");
//   // Start transaction
//   db.beginTransaction((err) => {
//     if (err) return callback(err);

//     // Delete from product_category table
//     const deleteProductCategoryQuery = `
//       DELETE FROM product_category
//       WHERE category_id IN (${placeholders});
//     `;
    
//     db.query(deleteProductCategoryQuery, categoryIds, (err, results) => {
//       if (err) {
//         return db.rollback(() => {
//           callback(err);
//         });
//       }

//       // Delete from categories table
//       const deleteCategoriesQuery = `
//         DELETE FROM categories
//         WHERE category_id IN (${placeholders});
//       `;

//       db.query(deleteCategoriesQuery, categoryIds, (err, results) => {
//         if (err) {
//           return db.rollback(() => {
//             callback(err);
//           });
//         }

//         // Commit the transaction
//         db.commit((err) => {
//           if (err) {
//             return db.rollback(() => {
//               callback(err);
//             });
//           }
//           callback(null, results);
//         });
//       });
//     });

//   });
// };

const getCategoryByID = (db, categoryID, callback)=>{
  const query = `SELECT category_id, category_name, image_url FROM categories WHERE category_id = ?;`;

  // db.query(query, categoryID,callback);
  queryDatabase(query, [categoryID], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
}

const getCategoriesByIDs = (db, categoryIDs, callback) => {
  const query = `SELECT category_id, category_name, image_url 
                 FROM categories 
                 WHERE category_id IN (?);`;
  
  // db.query(query, [categoryIDs], callback);
  queryDatabase(query, [categoryIDs], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
}

const getAllProductsNotInCategory = (db, categoryID, callback) => {
  const query = `
    SELECT p.product_id, p.name, p.price, p.stock, p.created_at
    FROM products p
    LEFT JOIN product_category pc ON p.product_id = pc.product_id AND pc.category_id = ?
    WHERE pc.product_id IS NULL;
  `;

  // db.query(query, [categoryID], callback);
  queryDatabase(query, [categoryID], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
  
};


const deleteSelectedProductsInCategory = (db, categoryID, productIDs, callback)=>{
  const query = `DELETE FROM product_category WHERE category_id = ? AND product_id IN (?);`

  // db.query(query, [categoryID, productIDs], callback)
  queryDatabase(query, [categoryID, productIDs], (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
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
      // db.query(insertProductCategoriesQuery, values, callback);
      queryDatabase(query, values, (err, results) => {
        if (err) return callback(err, null);  // Pass error to callback
        callback(null, results);              // Pass results to callback
      });
    };




module.exports = {
  createCategory,
  findAllCategories,
  findAllCategoriesWithGroupName,
  addProductsToCategory,
  getAllCategoriesWithCount,
  deleteCategoriesWithProducts,
  getCategoryByID,
  deleteSelectedProductsInCategory,
  getAllProductsNotInCategory,
  findCategoriesByType,
  setProductCategories,
  getCategoriesByIDs
};
