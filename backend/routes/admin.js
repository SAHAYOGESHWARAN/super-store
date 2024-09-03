// routes/admin.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Add product
router.post('/products', upload.single('image'), async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const image = req.file ? req.file.filename : 'default.jpg'; // Default image if no file uploaded

        const newProduct = new Product({
            name,
            description,
            price,
            image
        });

        await newProduct.save();
        res.json({ msg: 'Product added successfully' });
    } catch (error) {
        
        console.error('Error adding product:', error);
        res.status(500).json({ msg: 'Error adding product', error });
    }
});

module.exports = router;
