const express = require('express');
const router = express.Router();
const DiaryEntry = require('../models/diary');
const verifyToken = require('../middleware/auth'); // Updated to match the correct middleware file

// GET /api/diary/:date - Retrieve kj for a specific date
router.get('/:date', verifyToken, async (req, res) => {
    const { date } = req.params;
    const userId = req.user.id; // Extract user ID from the token (verified by verifyToken)
    try {
        const entry = await DiaryEntry.findOne({ userId, date });
        res.json(entry || { date, kj: null });
    } catch (error) {
        console.error('Error fetching diary entry:', error);
        res.status(500).json({ error: 'Failed to fetch diary entry' });
    }
});

// POST /api/diary/:date - Save kj for a specific date
router.post('/:date', verifyToken, async (req, res) => {
    console.log('POST request for date:', req.params.date);

    const { date } = req.params;
    const { kj } = req.body;
    const userId = req.user.id; // Extract user ID from the token (verified by verifyToken)

    if (isNaN(kj) || kj < 0) {
        return res.status(400).json({ error: 'Invalid kilojoule value' });
    }

    try {
        let entry = await DiaryEntry.findOne({ userId, date });

        if (entry) {
            // Update existing entry
            entry.kj = kj;
        } else {
            // Create a new entry
            entry = new DiaryEntry({ userId, date, kj });
        }

        await entry.save();
        res.json({ message: 'Diary entry saved', entry });
    } catch (error) {
        console.error('Error saving diary entry:', error);
        res.status(500).json({ error: 'Failed to save diary entry' });
    }
    console.log('Saving diary entry with userId:', userId);
});

module.exports = router;
