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
        const image = req.file ? req.file.filename : 'default.jpg';

        const newProduct = new Product({
            name,
            description,
            price,
            image
        });

        await newProduct.save();
        res.json({ msg: 'Product added successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'Error adding product', error });
    }
});

// Get all products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ msg: 'Error fetching products', error });
    }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'Error deleting product', error });
    }
});

module.exports = router;
