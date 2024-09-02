const express = require('express');
const Product = require('../models/product');

const router = express.Router();

// Create Product
router.post('/', async (req, res) => {
  const { name, price, quantity } = req.body;
  try {
    const newProduct = new Product({ name, price, quantity });
    await newProduct.save();
    res.status(201).send('Product added');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get Products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Update Product
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, quantity } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, { name, price, quantity }, { new: true });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete Product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    res.send('Product deleted');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
