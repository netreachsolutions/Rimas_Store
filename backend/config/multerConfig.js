// config/multerConfig.js
const multer = require('multer');
const path = require('path');

// Set up storage options with multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save the temporary files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname); // Unique file name to avoid overwriting
  },
});

// Initialize multer with diskStorage configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
});

module.exports = upload;
