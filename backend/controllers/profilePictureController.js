const multer = require('multer');
const User = require('../models/user');

// Configure storage for uploaded images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save profile pictures
    },
    filename: (req, file, cb) => {
        cb(null, `${req.user._id}-${Date.now()}-${file.originalname}`);
    }
});

// File filter for image types
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('File type not allowed'), false);
    }
};

// Set up multer middleware
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1 * 1024 * 1024 } // Limit to 1 MB
}).single('profilePicture');

// Controller function for uploading a profile picture
const uploadProfilePicture = (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(400).send({ error: err.message });

        try {
            const user = await User.findById(req.user._id);
            if (!user) return res.status(404).send({ error: 'User not found' });

            // Update user's profilePicture field with file path
            user.profilePicture = req.file.path;
            await user.save();

            res.send({ message: 'Profile picture updated successfully', profilePicture: user.profilePicture });
        } catch (error) {
            res.status(500).send({ error: 'Internal server error' });
        }
    });
};

module.exports = { uploadProfilePicture };
