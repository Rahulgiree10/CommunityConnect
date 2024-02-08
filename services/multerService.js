const multer = require('multer');

// Configure the storage destination and filename
const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/profilePicture');
    },
    filename: (req, file, cb) => {
        cb(null, 'profile-' + Date.now() + '-' + file.originalname);
    }
});

module.exports = { multer, profileStorage };
