const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const authenticateToken = require('../middleware/auth');

// Create a new product
router.post('/', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Access denied');

  const { name, price, quantity } = req.body;

  try {
    const product = new Product({ name, price, quantity });
    await product.save();
    res.status(201).send('Product created successfully');
  } catch (error) {
    res.status(400).send('Error creating product');
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Update a product
router.put('/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Access denied');

  const { name, price, quantity } = req.body;

  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { name, price, quantity }, { new: true });

    if (!product) return res.status(404).send('Product not found');

    res.json(product);
  } catch (error) {
    res.status(400).send('Error updating product');
  }
});

// Delete a product
router.delete('/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Access denied');

  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) return res.status(404).send('Product not found');

    res.send('Product deleted successfully');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
