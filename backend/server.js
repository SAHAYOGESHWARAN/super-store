const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/userModel');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const Product = require('./models/productModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Admin routes for managing products
app.post('/api/admin/products', upload.single('image'), async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const image = req.file ? req.file.filename : '';

        const product = new Product({ name, description, price, image });
        await product.save();

        res.json({ msg: 'Product added successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ msg: 'Error adding product' });
    }
});

app.get('/api/admin/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ msg: 'Error fetching products' });
    }
});

app.delete('/api/admin/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ msg: 'Error deleting product' });
    }
});

// Authentication Routes
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token, role: user.role });
        } else {
            res.status(400).json({ msg: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

app.post('/api/users/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
        return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    try {
        const user = new User({
            username,
            email,
            password: await bcrypt.hash(password, 10),
            role, // Save the role in the database
        });

        await user.save();
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (error) {
        if (error.code === 11000) { // Handle duplicate key error
            return res.status(400).json({ msg: 'Username or email already exists' });
        }
        console.error('Error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});


// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Use user routes
app.use('/api/users', require('./routes/user'));

// Example route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// Backend: Fetch products for the user
app.get('/api/user/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ msg: 'Error fetching products' });
    }
});
