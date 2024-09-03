// routes/authRoutes.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Adjust the path if needed
const router = express.Router();

router.post('/login', async (req, res) => {
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

module.exports = router;
