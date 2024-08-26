// routes/imageRoutes.js
const express = require('express');
const imageController = require('../controllers/imageController');
const upload = require('../config/multerConfig');

const router = express.Router();

router.post('/upload', upload.single('file'), imageController.uploadImage);

module.exports = router;
