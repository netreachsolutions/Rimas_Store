// utils/errorHandler.js

// Custom error class for operational errors
class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = true; // Flag to indicate operational errors
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  // Custom error handling middleware
  const errorHandler = (err, req, res, next) => {
    // Check if the error is an instance of AppError and handle operational errors
    if (err.isOperational) {
      res.status(err.statusCode).json({
        error: true,
        message: err.message,
      });
    } else {
      // Log the error details for debugging
      console.error("ERROR 💥", err);
  
      // Handle non-operational errors (unknown errors)
      res.status(500).json({
        error: true,
        message: "Internal Server Error",
      });
    }
  };
  
  // Export the error handler and custom error class
  module.exports = {
    errorHandler,
    AppError,
  };
  