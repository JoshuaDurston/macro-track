const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'funnySecretKey';

//POSTS
// Signup route
router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log('Signup failed: Username already exists'); // Log reason for failure
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password before saving
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user with hashed password
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        // Generate a JWT token
        const token = jwt.sign({ _id: newUser._id, username: newUser.username }, secretKey, { expiresIn: '2h' });
        console.log('Generated Token:', token); // Log the token

        // Send the response with token
        res.status(201).json({ token, user: { _id: newUser._id, username: newUser.username } });
    } catch (error) {
        console.error('Error signing up user:', error); // Detailed error logging
        res.status(500).json({ message: 'Error signing up user', error: error.message }); // Send the error message to the client
    }
});

module.exports = router;


// Login Route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ _id: user._id, username: user.username }, secretKey, { expiresIn: '1h' });

        // Send the token and user data back to the client
        res.status(200).json({ token, user: { _id: user._id, username: user.username } });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in user', error });
    }
});

//Bio Route
router.post('/:id/bio', async (req, res) => {
    const { bio } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.bio = bio;
        await user.save();
        res.status(200).json({ message: 'Bio updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update bio', error });
    }
});


//GETS
// Endpoint to get user profile
router.get('/:id/profile', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return bio and profilePicture
        res.json({ bio: user.bio || '', profilePicture: user.profilePicture || '/assets/Default_pfp.svg.png' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
