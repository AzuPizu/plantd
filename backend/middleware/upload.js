// backend/middleware/upload.js

const cloudinary = require('../config/cloudinaryConfig');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Define Cloudinary storage settings
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'plantd_uploads', // This is the folder name in your Cloudinary account
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});

// Create the Multer instance using the Cloudinary storage
const upload = multer({ storage: storage });

module.exports = upload;