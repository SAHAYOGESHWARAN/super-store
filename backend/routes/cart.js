// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const authMiddleware = require('../middleware/authMiddleware');

// Add to cart
router.post('/cart', authMiddleware, async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.id; 

    try {
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, products: [] });
        }

        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

        if (productIndex > -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await cart.save();
        res.json({ msg: 'Product added to cart' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

// View cart
router.get('/cart', authMiddleware, async (req, res) => {
    const userId = req.user.id;

    try {
        const cart = await Cart.findOne({ user: userId }).populate('products.product');
        res.json(cart);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Checkout
router.post('/checkout', authMiddleware, async (req, res) => {
    const { paymentMethod } = req.body;
    const userId = req.user.id;

    try {
        const cart = await Cart.findOne({ user: userId }).populate('products.product');
        if (!cart) return res.status(400).json({ msg: 'Cart not found' });

        // Here you would normally handle the payment process
        // For now, we'll just clear the cart

        cart.products = [];
        await cart.save();

        res.json({ msg: 'Order placed successfully', paymentMethod });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
