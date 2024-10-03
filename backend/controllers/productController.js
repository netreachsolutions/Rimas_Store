const db = require("../config/db");
const s3 = require('../config/awsConfig');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const ProductService = require("../services/productService");

exports.getAllProducts = async (req, res) => {
    try {
      console.log(`attemting to retrieve all products`)
      const products = await ProductService.allProducts(db);
      console.log(products)
      console.log('^^^ list of products ^^^')
      res.json(products);
    } catch (error) {
      console.error('Error during fetch:', error);
      res.status(400).json({ message: error.message });
    }
  };



  // exports.saveProduct = (req, res) => {
  //   console.log('Attemting to save product')
  //   const { name, description, price, weight, stock, imageUrl, categories, product_type_id } = req.body;
  //   console.log(req.body)
  //   ProductService.newProduct(db, { name, description, price, weight, stock, imageUrl, categories, product_type_id }, (err, result) => {
  //     if (err) {
  //       console.error('Error saving product:', err);
  //       return res.status(500).json({ message: 'Failed to save product' });
  //     }
  //     // res.json({ message: 'Product saved successfully', productId: result.insertId });
  //     console.log(res)
  //   });
  //   res.status(201).json({ message: 'Product saved successfully'})
  // };

  exports.saveProduct = async (req, res) => {
    console.log('Attempting to save product');
    
    // Destructure product details and the list of images from the request body
    const { name, description, price, weight, stock, categories, product_type_id } = req.body;
    const files = req.files; // Assuming files are being sent through `req.files` (multer setup for multiple file uploads)
    console.log(req.body)
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }
  
    const uploadedImageUrls = [];
  
    try {
      // Iterate through the files and upload them to S3
      for (const file of files) {
        const fileExtension = path.extname(file.originalname);
        const fileName = `${uuidv4()}${fileExtension}`;
        
        const params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: `uploads/${fileName}`, // Save with a unique name in S3
          Body: fs.createReadStream(file.path),
          ContentType: file.mimetype,
        };
        
        // Use the promise-based upload to S3
        const uploadResult = await s3.upload(params).promise();
        
        // Push the uploaded image URL to the array
        uploadedImageUrls.push(uploadResult.Location);
        
        // Remove the image from local storage after uploading
        fs.unlinkSync(file.path);
      }
  
      // At this point, all images have been uploaded successfully
      // const imageUrl = uploadedImageUrls.join(','); // Store as a comma-separated string or adjust as needed
  
      // Save the product details, including the image URLs, to the database
      const productData = {
        name,
        description,
        price,
        weight,
        stock,
        uploadedImageUrls,   // Include the image URLs here
        categories,
        product_type_id
      };
  
      const result = await ProductService.newProduct(db, productData);

      // Step 3: Send response after the product is saved successfully
      res.status(201).json({ message: 'Product saved successfully', result });
  
    } catch (err) {
      console.error('Error uploading images:', err);
      res.status(500).json({ message: 'Failed to upload images' });
    }
  };

  exports.getProductById = async (req, res) => {
    try {
      const productId = req.params.id; // Get product ID from URL params
      const product = await ProductService.findProductById(db, productId); // Fetch product by ID using ProductService
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.json({ product });
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ message: 'Failed to fetch product details' });
    }
  };

  exports.getProductsByCategory = async (req, res) => {
    const { categoryId } = req.params;
    try {
        const products = await ProductService.getProductsByCategory(db, categoryId);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ message: 'Failed to fetch products' });
    }

  };

  exports.getProductsByFilters = async (req, res) => {
    const { filters } = req.body;
    console.log('attemting to retrieve products by filters')
    try {
        const products = await ProductService.getProductsWithFilters(db, filters);
        console.log(products)
        res.json(products);
    } catch (error) {
        console.error('Error fetching products by filters:', error);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
  };
