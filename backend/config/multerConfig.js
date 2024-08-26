// config/multerConfig.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Temp directory for uploads
  },
  filename: (req, file, cb) => {
    console.log('filename: '+file.originalname)
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
