const Product = require('../models/productModel');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

const getProducts = async (req, res) => {
    const products = await Product.find({});
    res.json(products);
};

const addProduct = async (req, res) => {
    const { name, description, price } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !description || !price || !image) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const product = await Product.create({ name, description, price, image });
    res.status(201).json(product);
};

const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.remove();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

module.exports = { getProducts, addProduct, deleteProduct, upload };
