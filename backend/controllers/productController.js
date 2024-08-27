const db = require("../config/db");
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



  exports.saveProduct = (req, res) => {
    console.log('Attemting to save product')
    const { name, description, price, stock, imageUrl } = req.body;
    console.log(req.body)
    ProductService.newProduct(db, { name, description, price, stock, imageUrl }, (err, result) => {
      if (err) {
        console.error('Error saving product:', err);
        return res.status(500).json({ message: 'Failed to save product' });
      }
      // res.json({ message: 'Product saved successfully', productId: result.insertId });
      console.log(res)
    });
    res.status(201).json({ message: 'Product saved successfully'})
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