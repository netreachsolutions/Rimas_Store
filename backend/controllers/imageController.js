const s3 = require('../config/awsConfig');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

exports.uploadImages = async (req, res) => {
  // Check if files are uploaded
  if (!req.files || req.files.length === 0) {
    console.error('Error uploading files: No files uploaded');
    return res.status(400).send({ error: 'No files uploaded' });
  }

  // Array to store uploaded image URLs
  const uploadedFiles = [];

  try {
    // Iterate over each file in req.files
    for (const file of req.files) {
      const fileExtension = path.extname(file.originalname);
      const fileName = `${uuidv4()}${fileExtension}`;

      console.log('Original fileName: ' + file.originalname);

      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `uploads/${fileName}`, // File name you want to save in S3
        Body: fs.createReadStream(file.path),
        ContentType: file.mimetype,
      };

      // Use promises to upload each file and wait for the result
      const uploadResult = await s3.upload(params).promise();

      // Remove the file from local storage
      fs.unlinkSync(file.path);

      // Add the uploaded file URL to the result array
      uploadedFiles.push(uploadResult.Location);
    }

    // Send back the array of uploaded file URLs
    return res.send({ message: 'Files uploaded successfully', imageUrls: uploadedFiles });
  } catch (error) {
    console.error('Error uploading files:', error);
    return res.status(500).send({ error: 'Failed to upload files to S3' });
  }
};

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