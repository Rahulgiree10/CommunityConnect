const express = require('express');
const router = express.Router();
const communityController = require('../controller/communityController');

router.route("/").get(communityController.index);

router.route("/login").get(communityController.renderLogin).post(communityController.login);

router.route('/signup').get(communityController.renderSignup).post(communityController.signup);

router.route('/OTPSend').get(communityController.renderForgotPassword).post(communityController.verifyEmail);

router.route('/OTPVerify').get(communityController.renderOTPSend).post(communityController.verifyOTP);

router.route('/resetPassword').get(communityController.renderEnterNewPassword).post(communityController.resetPassword);

router.route('/organizationHome').get();

module.exports = router;
