// middleware/auth.js
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'funnySecretKey';

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    console.log('Authorization header:', req.headers['authorization']); // Log the header
    console.log('Extracted token:', token); // Log the extracted token

    if (!token) {
        console.log('No token provided');
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.log('Token verification failed:', err.message); // Log error
            return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
        }
        console.log('Decoded token:', decoded); // Log decoded payload
        req.user = decoded;
        next();
    });
};
module.exports = verifyToken;
