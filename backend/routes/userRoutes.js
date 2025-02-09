const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/auth'); // Import middleware
const secretKey = process.env.JWT_SECRET || 'funnySecretKey';

// POST: Signup route
router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Signup attempt with username:', username);

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log('Signup failed: Username already exists');
            return res.status(400).json({ message: 'Username already exists' });
        }
        console.log('Username available, proceeding with signup');

        // Hash the password before saving
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log('Password hashed successfully');

        // Create new user with hashed password
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        console.log('User created successfully:', newUser.username);

        // Send a response without the token
        res.status(201).json({ message: 'Signup successful. Please log in.' });
    } catch (error) {
        console.error('Error signing up user:', error);
        res.status(500).json({ message: 'Error signing up user', error: error.message });
    }
});

// POST: Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt with username:', username);

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            console.log('Login failed: User not found');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            console.log('Login failed: Incorrect password');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('Login successful for user:', user.username);

        // Generate a JWT token
        const token = jwt.sign({ _id: user._id, username: user.username }, secretKey, { expiresIn: '2h' });
        console.log('Generated Token:', token);

        // Send the token and user data back to the client
        res.status(200).json({ token, user: { _id: user._id, username: user.username } });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Error logging in user', error: error.message });
    }
});

// POST: Update bio (user-specific)
router.post('/bio', verifyToken, async (req, res) => {
    const { bio } = req.body;
    console.log('Updating bio for user:', req.user.username);

    try {
        const user = await User.findById(req.user._id); // Use req.user.id from middleware
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        user.bio = bio;
        await user.save();
        console.log('Bio updated successfully for user:', user.username);

        res.status(200).json({ message: 'Bio updated successfully' });
    } catch (error) {
        console.error('Failed to update bio:', error);
        res.status(500).json({ message: 'Failed to update bio', error });
    }
});

// GET: User profile (user-specific)
router.get('/profile', verifyToken, async (req, res) => {
    console.log('Fetching profile for user:', req.user.username);

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        // Return bio and profilePicture
        console.log('User profile fetched successfully:', user.username);

        res.json({
            bio: user.bio || '',
            profilePicture: user.profilePicture || '/assets/Default_pfp.svg.png',
        });
    } catch (error) {
        console.error('Server error while fetching profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
