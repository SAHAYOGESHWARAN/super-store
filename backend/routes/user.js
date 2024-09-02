const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); 
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;