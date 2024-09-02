const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Add new product
router.post('/products', upload.single('image'), async (req, res) => {
    const { name, description, price } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !description || !price) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        const newProduct = new Product({
            name,
            description,
            price,
            image
        });

        await newProduct.save();
        res.status(201).json({ msg: 'Product added successfully' });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Get all products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Update product
router.put('/products/:id', upload.single('image'), async (req, res) => {
    const { name, description, price } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            name,
            description,
            price,
            image
        }, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        res.status(200).json({ msg: 'Product deleted successfully' });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
