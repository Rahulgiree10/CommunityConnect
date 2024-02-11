const multer = require('multer');

// Configure the storage destination and filename of profile picture
const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/profilePicture');
    },
    filename: (req, file, cb) => {
        cb(null, 'profile-' + Date.now() + '-' + file.originalname);
    }
});

// Configure the storage destination and filename of PANPicture
const PANPictureStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/PANPicture');
    },
    filename: (req, file, cb) => {
        cb(null, 'PAN-' + Date.now() + '-' + file.originalname);
    }
});

module.exports = { multer, profileStorage, PANPictureStorage};
