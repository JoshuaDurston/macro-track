const mongoose = require('mongoose');

const DiarySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Ensure every entry is tied to a user
    date: { type: String, required: true }, // YYYY-MM-DD
    kj: { type: Number, default: 0 },
});

module.exports = mongoose.model('Diary', DiarySchema);
