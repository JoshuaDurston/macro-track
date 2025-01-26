const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const diaryRoutes = require('./routes/diaryRoutes'); // Import the diary routes
const userRoutes = require('./routes/userRoutes'); // Import the user routes
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from the 'frontend/public' directory
app.use('/public', express.static('frontend/public'));
app.use('/uploads', express.static('uploads'));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/diary', diaryRoutes); // Diary-related routes
app.use('/api/users', userRoutes); // User-related routes

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error);
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
