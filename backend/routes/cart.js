const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/productModel');
const { auth } = require('../middleware/authMiddleware');
const router = express.Router();

// Add product to cart
router.post('/', auth, async (req, res) => {
    const { productId } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            cart = new Cart({
                user: req.user.id,
                products: []
            });
        }

        cart.products.push(product);
        await cart.save();
        res.status(201).json(cart);

    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's cart
router.get('/', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate('products');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
