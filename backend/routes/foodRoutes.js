const express = require('express');
const Food = require('../models/food');
const router = express.Router();

// Get all foods
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Add a food
router.post('/', async (req, res) => {
  try {
    const newFood = new Food(req.body);
    const savedFood = await newFood.save();
    res.json(savedFood);
  } catch (error) {
    res.status(400).json({ message: 'Bad Request' });
  }
});

module.exports = router;