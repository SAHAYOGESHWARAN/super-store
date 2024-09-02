const express = require('express');
const multer = require('multer');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Create a new product
router.post('/', [auth, adminAuth, upload.single('image')], async (req, res) => {
    const { name, description, price } = req.body;
    const image = req.file.filename;
    try {
        const newProduct = new Product({
            name,
            description,
            price,
            image
        });

        const product = await newProduct.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a product
router.delete('/:id', [auth, adminAuth], async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.remove();
        res.status(200).json({ message: 'Product removed' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
