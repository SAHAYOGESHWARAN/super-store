const express = require('express');
const { getProducts, addProduct, deleteProduct, upload } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(protect, admin, upload.single('image'), addProduct);

router.route('/:id')
    .delete(protect, admin, deleteProduct);

module.exports = router;
