
const {
  createCategory,
  findAllCategories,
  findAllCategoriesWithGroupName,
  addProductsToCategory,
  getAllCategoriesWithCount,
  deleteCategoriesWithProducts,
  getCategoryByID,
  deleteSelectedProductsInCategory,
  getAllProductsNotInCategory,
  getCategoriesByIDs
} = require("../models/categoryModel");
const { reject } = require("bcrypt/promises");
const { getCategory } = require("../controllers/categoryController");

class CategoryService {
  static async createCategory(categoryData) {
    return new Promise((resolve, reject) => {
      createCategory(categoryData, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  static async addToCategory(categoryId, productIds) {
    return new Promise((resolve, reject) => {
      addProductsToCategory(categoryId, productIds, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  static async getAllCategories(db) {
    return new Promise((resolve, reject) => {
      findAllCategories((err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  static async getCategoriesByIds(categoryIds) {
    return new Promise((resolve, reject) => {
      getCategoriesByIDs(categoryIds, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  static async getCategoriesByType(db) {
    return new Promise((resolve, reject) => {
      findAllCategoriesWithGroupName((err, result) => {
        console.log(result);
        if (err) return reject(err);
  
        // Restructure the result by grouping categories by their type
        const categoriesByType = result.reduce((acc, category) => {
          const { category_group_id, category_id, category_name, group_name } = category;
  
          // Ensure the accumulator has an array for this type
          if (!acc[category_group_id]) {
            acc[category_group_id] = {name: group_name, items:[]};
          }
          console.log(category_group_id)
          // Add the category to the array for its type
          acc[category_group_id].items.push({ category_id, category_name, category_group_id });
  
          return acc;
        }, {});
  
        resolve(categoriesByType);
      });
    });
  }
  
  static async getAllCategoriesWithCount(db){
    return new Promise((resolve, reject) =>{
      getAllCategoriesWithCount((err, result) => {
        if (err) return reject(err);
        resolve(result);
      })
    })
  }
  
  static async deleteCategoriesWithProducts(categoryId){
    return new Promise((resolve, reject) =>{
      deleteCategoriesWithProducts(categoryId, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      })
    })
  }

  static async getCategoryByID(categoryId){
    return new Promise((resolve,reject)=>{
      getCategoryByID(db,categoryId, (err,result)=>{
        if(err) return reject(err);
        resolve(result);
      })
    })
  }

  static async deleteProductsInCategory(db,categoryId,productIds){
    return new Promise((resolve,reject)=>{
      deleteSelectedProductsInCategory(categoryId, productIds, (err,result)=>{
        if(err) return reject(err);
        resolve(result);
      })
    })
  }

  static async getAllProductsNotInCategoryService(categoryId){
    return new Promise((resolve,reject)=>{
      getAllProductsNotInCategory(categoryId, (err,result)=>{
        if(err) return reject(err);
        resolve(result);
      })
    })
  }
}

module.exports = CategoryService;
