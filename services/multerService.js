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

// Configure the storage destination and filename of document
const documentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/document');
    },
    filename: (req, file, cb) => {
        cb(null, 'document-' + Date.now() + '-' + file.originalname);
    }
});

// Configure the storage destination and filename of document
const qrStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('I am working.')
        cb(null, './uploads/qr');
    },
    filename: (req, file, cb) => {
        cb(null, 'qr-' + Date.now() + '-' + file.originalname);
    }
});

module.exports = { multer, profileStorage, PANPictureStorage, documentStorage, qrStorage};
