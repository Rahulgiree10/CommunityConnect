const express = require('express');
const router = express.Router();
const communityController = require('../controller/communityController');

router.route("/").get(communityController.index);

router.route("/login").get(communityController.renderLogin).post(communityController.login);

router.route('/signup').get(communityController.renderSignup).post(communityController.signup);

router.route('/organizationHome').get();

module.exports = router;
