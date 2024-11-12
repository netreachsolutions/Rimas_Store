// models/productModel.js
const { queryDatabase } = require('../config/pool');


const createProduct = (productData, callback) => {
    const { name, description, price, weight, stock, product_type_id } = productData;
    const query = 'INSERT INTO products (name, description, price, product_weight, stock, product_type_id) VALUES (?, ?, ?, ?, ?, ?)';
    // db.query(query, [name, description, price, weight, stock, product_type_id], callback);
    queryDatabase(query, [name, description, price, weight, stock, product_type_id], (err, results) => {
      if (err) return callback(err, null);  // Pass error to callback
      callback(null, results);              // Pass results to callback
    });
  };
  
  const findProductById = (productId, callback) => {
    const query = 'SELECT * FROM products WHERE product_id = ?';
    // db.query(query, [productId], callback);
    queryDatabase(query, [productId], (err, results) => {
      if (err) return callback(err, null);  // Pass error to callback
      callback(null, results);              // Pass results to callback
    });
  };

  const findProductByIdWithImages = (productId, callback) => {
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

  const findProductSizes = (productId, callback) => {
    const query = `
    SELECT pc.*, c.*
    FROM product_category pc
    JOIN categories c ON pc.category_id = c.category_id
    WHERE c.category_group_id = 2
    AND pc.product_id = ?;
    `
    queryDatabase(query, [productId], (err, results) => {
      callback(null, results)
    })
  }

  const findProductImages = (productId, callback) => {
    const query = `
    SELECT product_image.image_url, product_image.priority
    FROM product_image
    WHERE product_image.product_id = ?
    ORDER BY product_image.priority ASC;
    `;

    queryDatabase(query, [productId], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  };

  const getAllProducts = (callback) => {
    const query = 'SELECT * FROM products WHERE is_active = TRUE';
    db.query(query, callback);
    queryDatabase(query, [], (err, results) => {
      if (err) return callback(err, null);  // Pass error to callback
      callback(null, results);              // Pass results to callback
    });
  };


  const getAllProductsWithImage = async (callback) => {
    const query = 'SELECT products.product_id, products.name, products.description, products.is_active, products.price, products.stock, product_image.image_url FROM products LEFT JOIN product_image ON products.product_id = product_image.product_id AND (product_image.priority = (SELECT MIN(COALESCE(priority, -1)) FROM product_image WHERE product_image.product_id = products.product_id) OR (product_image.priority IS NULL AND NOT EXISTS (SELECT 1 FROM product_image WHERE product_image.product_id = products.product_id AND product_image.priority IS NOT NULL)));';
    // Use queryDatabase and pass in a callback
    queryDatabase(query, [], (err, results) => {
      if (err) return callback(err, null);  // Pass error to callback
      callback(null, results);              // Pass results to callback
    });
  };

  const getAllActiveProductsWithImage = async (callback) => {
    const query = 'SELECT products.product_id, products.name, products.description, products.price, products.stock, product_image.image_url FROM products LEFT JOIN product_image ON products.product_id = product_image.product_id AND (product_image.priority = (SELECT MIN(COALESCE(priority, -1)) FROM product_image WHERE product_image.product_id = products.product_id) OR (product_image.priority IS NULL AND NOT EXISTS (SELECT 1 FROM product_image WHERE product_image.product_id = products.product_id AND product_image.priority IS NOT NULL))) WHERE products.is_active = TRUE;';
    // Use queryDatabase and pass in a callback
    queryDatabase(query, [], (err, results) => {
      if (err) return callback(err, null);  // Pass error to callback
      callback(null, results);              // Pass results to callback
    });
  };




 const createProductImage = (imageData, callback) => {
    const {productId, imageUrl} = imageData;
    const query = 'INSERT INTO product_image (product_id, image_url) VALUES (?, ?)';
    // db.query(query, [productId, imageUrl], callback)
    queryDatabase(query, [productId, imageUrl], (err, results) => {
      if (err) return callback(err, null);  // Pass error to callback
      callback(null, results);              // Pass results to callback
    });
 }

 const createProductImages = (productId, imageUrls, callback) => {
  // Prepare an array to store the SQL values
  const values = [];

  // Construct the values array for each productId
  imageUrls.forEach((imageUrl, index) => {
    values.push(productId, imageUrl, index+1);
  });
  console.log("values:");
  console.log(values);

  const placeholders = imageUrls.map(() => "(?, ?, ?)").join(", ");
  const query = `INSERT INTO product_image (product_id, image_url, priority) VALUES ${placeholders}`;
  // db.query(query, [productId, imageUrl], callback)
  queryDatabase(query, values, (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
}

const updateProductsActiveStatus = (productIds, isActive, callback) => {
  // Convert `isActive` to a binary value (0 or 1)
  const activeStatus = isActive ? 1 : 0;

  // Construct the SQL query with placeholders
  const query = `
    UPDATE products 
    SET is_active = ? 
    WHERE product_id IN (${productIds.map(() => '?').join(', ')});
  `;

  // Prepare the query parameters
  const queryParams = [activeStatus, ...productIds];

  // Execute the query
  queryDatabase(query, queryParams, (err, results) => {
    if (err) return callback(err, null);  // Pass error to callback
    callback(null, results);              // Pass results to callback
  });
};

  
 const getProductsByCategoryId = (categoryId, callback) => {
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

// const getProductsByCategoryIdsAndPriceRange = (categoryIds, minPrice, maxPrice, callback) => {
//   // let query = `
//   //   SELECT 
//   //       p.product_id, 
//   //       p.name, 
//   //       p.description, 
//   //       p.price, 
//   //       p.stock, 
//   //       p.created_at, 
//   //       pi.image_url
//   //   FROM 
//   //       products p
//   //   LEFT JOIN 
//   //       product_category pc ON p.product_id = pc.product_id
//   //   LEFT JOIN 
//   //       categories c ON pc.category_id = c.category_id
//   //   LEFT JOIN 
//   //       product_image pi ON pi.product_id = p.product_id
//   //   WHERE is_active = 1`;  // Always true, makes adding conditions easier
//   let query = `
//   SELECT
//     p.product_id,
//     p.name,
//     p.description,
//     p.price,
//     p.stock,
//     p.created_at,
//     pi.image_url,
//     pi.priority,
//     pi.product_image_id
// FROM
//     products p
// LEFT JOIN
//     product_category pc ON p.product_id = pc.product_id
// LEFT JOIN
//     categories c ON pc.category_id = c.category_id
// LEFT JOIN
//     product_image pi ON pi.product_id = p.product_id
// WHERE
//     is_active = 1
//   `

//   const queryParams = [];

//   if (categoryIds && categoryIds.length > 0) {
//     // query += ` AND p.product_id IN (
//     //   SELECT product_id FROM product_category WHERE category_id IN (?) GROUP BY product_id HAVING COUNT(DISTINCT category_id) = ?
//     // )`;
//     query += ` AND p.product_id IN (
//         SELECT product_id
//         FROM product_category
//         WHERE category_id IN (?))`
//     queryParams.push(categoryIds, categoryIds.length);
//   }

//   if (minPrice !== null) {
//     query += ` AND p.price >= ?`;
//     queryParams.push(minPrice);
//   }

//   if (maxPrice !== null) {
//     query += ` AND p.price <= ?`;
//     queryParams.push(maxPrice);
//   }

//   query += `
//     GROUP BY 
//         p.product_id,  -- Group by the product details to avoid duplicates
//         p.name, 
//         p.description, 
//         p.price, 
//         p.stock, 
//         p.created_at
//     ORDER BY 
//         MIN(pi.priority) IS NULL,  -- Orders rows with NULL priority last
//         MIN(pi.priority) ASC,     -- Highest priority images first
//         MIN(pi.image_url) ASC;
//   `;

//   console.log(queryParams);  // Log parameters for debugging
//   console.log(query);        // Log query for debugging

//   // db.query(query, queryParams, callback);
//   queryDatabase(query, queryParams, (err, results) => {
//     if (err) return callback(err, null);  // Pass error to callback
//     callback(null, results);              // Pass results to callback
//   });

  
// };

const getProductsByCategoryIdsAndPriceRange = (db, categoryIds, minPrice, maxPrice, callback) => {
  // First, get the category_group_id for each selected category_id
  const getCategoryGroupsQuery = `SELECT category_id, category_group_id FROM categories WHERE category_id IN (?)`;

  db.query(getCategoryGroupsQuery, [categoryIds], (err, categoryGroupRows) => {
    if (err) return callback(err);

    // Group the categoryIds by their category_group_id
    const categoriesByGroup = {};

    categoryGroupRows.forEach(row => {
      const groupId = row.category_group_id;
      if (!categoriesByGroup[groupId]) {
        categoriesByGroup[groupId] = [];
      }
      categoriesByGroup[groupId].push(row.category_id);
    });

    // Construct the main query
    let query = `
      SELECT
        p.product_id,
        p.name,
        p.description,
        p.price,
        p.stock,
        p.created_at,
        pi.image_url,
        pi.priority
      FROM
        products p
      LEFT JOIN
        product_category pc ON p.product_id = pc.product_id
      LEFT JOIN
        categories c ON pc.category_id = c.category_id
      LEFT JOIN
        product_image pi ON pi.product_id = p.product_id
      WHERE
        p.is_active = 1
    `;

    const queryParams = [];

    // Build WHERE conditions to ensure products have at least one category from each selected group
    const whereConditions = [];

    Object.keys(categoriesByGroup).forEach(groupId => {
      const categoryIdsInGroup = categoriesByGroup[groupId];

      // Create placeholders for the category IDs
      const placeholders = categoryIdsInGroup.map(() => '?').join(',');

      // Add EXISTS condition for this group
      const condition = `
        EXISTS (
          SELECT 1 FROM product_category pc2
          JOIN categories c2 ON pc2.category_id = c2.category_id
          WHERE pc2.product_id = p.product_id
            AND c2.category_group_id = ?
            AND c2.category_id IN (${placeholders})
        )
      `;
      whereConditions.push(condition);

      // Add groupId and categoryIdsInGroup to queryParams
      queryParams.push(groupId);
      queryParams.push(...categoryIdsInGroup);
    });

    if (whereConditions.length > 0) {
      query += ' AND ' + whereConditions.join(' AND ');
    }

    // Add price filtering if applicable
    if (minPrice !== null && minPrice !== '') {
      query += ` AND p.price >= ?`;
      queryParams.push(minPrice);
    }

    if (maxPrice !== null && maxPrice !== '') {
      query += ` AND p.price <= ?`;
      queryParams.push(maxPrice);
    }

    // Group and order the results
    query += `
      GROUP BY 
        p.product_id, 
        p.name, 
        p.description, 
        p.price, 
        p.stock, 
        p.created_at
      ORDER BY 
        priority IS NULL,  
        priority ASC;
    `;

    console.log('Query Parameters:', queryParams);  // For debugging
    console.log('Query:', query);                   // For debugging

    // Execute the query with parameters
    db.query(query, queryParams, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  });
};

// Dummy helper function to get category type ID - replace this with actual logic
const getCategoryTypeId = (categoryId) => {
  // This should retrieve the type for each category (e.g., Gender, Size) based on categoryId
};





const updateProductStock = (products, callback) => {
  const queries = products.map(() => `UPDATE products SET stock = stock - ? WHERE product_id = ? AND stock >= ?;`).join(' ');
  const queryParams = [];

  // Prepare query parameters for each product (quantity and productId)
  products.forEach(product => {
    queryParams.push(product.quantity, product.product_id, product.quantity);
  });

  queryDatabase(queries, queryParams, (err, results) => {
    if (err) return callback(err, null);

    // Check if the number of affected rows matches the number of products being updated
    const totalAffectedRows = results.affectedRows;
    if (totalAffectedRows < products.length) {
      return callback(new Error('Insufficient stock for one or more products'), null);
    }

    callback(null, results);
  });
};


  module.exports = {
    createProduct,
    findProductById,
    getAllProducts,
    createProductImage,
    createProductImages,
    getAllProductsWithImage,
    findProductByIdWithImages,
    getProductsByCategoryId,
    getProductsByCategoryIdsAndPriceRange,
    findProductImages,
    findProductSizes,
    updateProductStock,
    updateProductsActiveStatus,
    getAllActiveProductsWithImage
  };
  