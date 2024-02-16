const express = require('express');
const router = express.Router();
const{profileStorage,multer}=require('../services/multerService');
const communityController = require('../controller/communityController');
const upload=multer({storage:profileStorage});
const signupValidator = require('../Validator/validateRegistration');

router.route("/").get(communityController.index);

router.route("/AboutUs").get(communityController.AboutUs);

router.route("/ContactUs").get(communityController.ContactUs);

router.route("/login").get(communityController.renderLogin).post(communityController.login);

router.route('/signup').get(communityController.renderSignup).post(upload.single('profilePic'),signupValidator,communityController.signup);

router.route('/OTPSend').get(communityController.renderForgotPassword).post(communityController.verifyEmail);

router.route('/OTPVerify').get(communityController.renderOTPSend).post(communityController.verifyOTP);

router.route('/resetPassword').get(communityController.renderEnterNewPassword).post(communityController.resetPassword);
router.route('/logout').get(communityController.logout);

router.route('/organizationHome').get();

module.exports = router;
