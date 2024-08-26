// controllers/imageController.js
const s3 = require('../config/awsConfig');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs')
const path = require('path');


exports.uploadImage = (req, res) => {
    if (!req.file) {
        console.error('Error uploading file:', 'No file uploaded');
        return res.status(400).send({ error: 'No file uploaded' });
      }
    

  const file = req.file;
  const fileExtension = path.extname(file.originalname);
  const fileName = `${uuidv4()}${fileExtension}`;

    console.log('original fileName: '+file.originalname)

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `uploads/${fileName}`, // File name you want to save as in S3
    Body: fs.createReadStream(file.path),
    ContentType: file.mimetype,
  };

  s3.upload(params, (err, data) => {
    fs.unlinkSync(file.path); // Delete file from local storage
    if (err) {
      console.error('Error uploading file:', err);
      return res.status(500).send({ error: 'Failed to upload file to S3' });
    }
    console.log('s3 Response: '+data.Location)
    res.send({ message: 'File uploaded successfully', imageUrl: data.Location });
  });
};