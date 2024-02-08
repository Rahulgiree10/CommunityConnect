const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const user = require('../model/community').user; // Assuming this is where your user model is imported from

//To use .env file use these two lines 
const dotenv=require('dotenv')
dotenv.config()

exports.isAuthenticated = async (req, res, next) => {
    try {
        // Extract token from cookies
        const token = req.cookies.token;

        // If token doesn't exist, redirect to homepage with failure flash message
        if (!token) {
            return res.redirect('/');
        }

        // Verify the token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);

        // Find the user associated with the token
        const loggedInUser = await user.findOne({ where: { id: decoded.id } });

        // If user not found, redirect to homepage with failure flash message
        if (!loggedInUser) {
            return res.redirect('/');
        }

        // Attach the user information to the request object
        req.user = loggedInUser;
        next();
    } 
    catch (error) 
    {
        console.error('Authentication error:', error);
        res.redirect('/');
    }
};
