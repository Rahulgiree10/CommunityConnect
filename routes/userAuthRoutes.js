const express = require('express');
const router = express.Router();
const{profileStorage,multer}=require('../services/multerService');
const communityController = require('../controller/communityController');
const upload=multer({storage:profileStorage});
const signupValidator = require('../Validator/validateRegistration');
const loginValidator = require('../Validator/LoginValidator');

router.route("/").get(communityController.index);

router.route("/AboutUs").get(communityController.AboutUs);

router.route("/ContactUs").get(communityController.ContactUs);

router.route("/login").get(communityController.renderLogin).post(loginValidator, communityController.login);

router.route('/signup').get(communityController.renderSignup).post(upload.single('profilePic'),signupValidator,communityController.signup);

router.route('/SignupOTP').get(communityController.renderSignupOTP).post(communityController.verifySignupOTP);

router.route('/OTPSend').get(communityController.renderForgotPassword).post(communityController.verifyEmail);

router.route('/OTPVerify').get(communityController.renderOTPSend).post(communityController.verifyOTP);

router.route('/resetPassword').get(communityController.renderEnterNewPassword).post(communityController.resetPassword);

router.route('/logout').get(communityController.logout);

module.exports = router;
