const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); 
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            username,
            password: hashedPassword,
        });

        // Save user to the database
        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
