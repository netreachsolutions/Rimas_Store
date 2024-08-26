const db = require("../config/db");
const CategoryService = require('../services/categoryService');

exports.createCategory = async (req, res) => {
    try {
        const {name, description} = req.body;
        await CategoryService.createCategory(db, {name, description});
        res.status(201).json({ message: "Category created successfully" });
      } catch (error) {
        console.error('Error during category creation:', error);
        res.status(500).json({ message: 'Category creation failed' });
      }

}

exports.addProductsToCategory = async (req, res) => {
    try {
        const {productIds, categoryId} = req.body;
        console.log(productIds)
        await CategoryService.addToCategory(db, categoryId, productIds);
        res.json({message: 'Product added to category sucessfully'});
    } catch (error) {
        console.error('Error during adding product to category:', error);
        res.status(500).json({ message: 'Product add to category failed' });    
    }
}

exports.retrieveAllCategories = async (req, res) => {
    try {
        const categories = await CategoryService.getAllCategories(db)
        res.json(categories);
        
    } catch (error) {
        console.error('Error during fetch:', error);
        res.status(400).json({ message: error.message });
    }
}