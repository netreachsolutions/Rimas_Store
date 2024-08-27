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

exports.getAllCategoriesWithCount = async (req, res) =>{
    try{
        const categoriesWithCount = await CategoryService.getAllCategoriesWithCount(db);
        res.json(categoriesWithCount)
    }catch (error){
        console.error('Error during fetch:', error);
        res.status(400).json({ message: error.message });
    }
}

exports.deleteCategoriesByIDs = async (req, res) =>{
    try{
        const categoryIDs = req.body.selectedCategories
        console.log("\nREQ BODY:", req.body)
        await CategoryService.deleteCategoriesWithProducts(db, categoryIDs);
        res.json({ message: "Deleted Categories with successfully" })
    }catch (error){
        console.error('Error during deleting categories:', error);
        res.status(500).json({ message: error.message });
    }
}

exports.getCategory = async (req, res) => {
    const {categoryId} = req.params;

    try{
        console.log("Request controller: ",req.params)
        const category = await CategoryService.getCategoryByID(db,categoryId);
        res.json(category)
    } 
    catch (error){
        console.error("Error fetching category: ",error);
        res.status(400).json({ message: error.message })
    }  
}

exports.deleteProducts = async (req, res) => {
    try{
        const productIds = req.body.productIds;
        const categoryID = req.body.categoryId;
        await CategoryService.deleteProductsInCategory(db, categoryID, productIds);
        res.json({"message":"Deleted products from category sucessfully"});
    } 
    catch (error){
        console.error("Error fetching category: ",error);
        res.status(500).json({ message: error.message });
    }  
}

exports.getAllProductsNotInCategory = async (req, res) => {
    const {categoryId} = req.params;

    try{
        const products = await CategoryService.getAllProductsNotInCategoryService(db, categoryId);
        res.json(products);
    } 
    catch (error){
        console.error("Error fetching products: ",error);
        res.status(400).json({ message: error.message });
    }  
}