
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
  static async createCategory(db, categoryData) {
    return new Promise((resolve, reject) => {
      createCategory(db, categoryData, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  static async addToCategory(db, categoryId, productIds) {
    return new Promise((resolve, reject) => {
      addProductsToCategory(db, categoryId, productIds, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  static async getAllCategories(db) {
    return new Promise((resolve, reject) => {
      findAllCategories(db, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  static async getCategoriesByIds(db, categoryIds) {
    return new Promise((resolve, reject) => {
      getCategoriesByIDs(db, categoryIds, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  static async getCategoriesByType(db) {
    return new Promise((resolve, reject) => {
      findAllCategoriesWithGroupName(db, (err, result) => {
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
          acc[category_group_id].items.push({ category_id, category_name });
  
          return acc;
        }, {});
  
        resolve(categoriesByType);
      });
    });
  }
  
  static async getAllCategoriesWithCount(db){
    return new Promise((resolve, reject) =>{
      getAllCategoriesWithCount(db, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      })
    })
  }
  
  static async deleteCategoriesWithProducts(db, categoryId){
    return new Promise((resolve, reject) =>{
      deleteCategoriesWithProducts(db, categoryId, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      })
    })
  }

  static async getCategoryByID(db, categoryId){
    return new Promise((resolve,reject)=>{
      getCategoryByID(db,categoryId, (err,result)=>{
        if(err) return reject(err);
        resolve(result);
      })
    })
  }

  static async deleteProductsInCategory(db,categoryId,productIds){
    return new Promise((resolve,reject)=>{
      deleteSelectedProductsInCategory(db, categoryId, productIds, (err,result)=>{
        if(err) return reject(err);
        resolve(result);
      })
    })
  }

  static async getAllProductsNotInCategoryService(db, categoryId){
    return new Promise((resolve,reject)=>{
      getAllProductsNotInCategory(db, categoryId, (err,result)=>{
        if(err) return reject(err);
        resolve(result);
      })
    })
  }
}

module.exports = CategoryService;
