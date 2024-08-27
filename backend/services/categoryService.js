
const {
  createCategory,
  findAllCategories,
  addProductsToCategory,
  getAllCategoriesWithCount,
  deleteCategoriesWithProducts

} = require("../models/categoryModel");

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

  static async getAllCategoriesWithCount(db){
    return new Promise((resolve, reject) =>{
      getAllCategoriesWithCount(db, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      })
    })
  }
  
  static async deleteCategoriesWithProducts(db, categoryIds){
    console.log(categoryIds);
    return new Promise((resolve, reject) =>{
      deleteCategoriesWithProducts(db, categoryIds, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      })
    })
  }
}

module.exports = CategoryService;
