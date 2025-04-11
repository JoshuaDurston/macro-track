const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String },
    profilePicture: {type: String, default: 'frontend/public/assets/Default_pfp.svg.png'},
    weight: {type: Number},

});

const User = mongoose.model('User', userSchema);

module.exports = User;