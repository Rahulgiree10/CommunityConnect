const router = require ('express').Router();
const { or } = require('sequelize');
const organizationController = require ('../controller/organizationController');
const authenticateUser=require('../middleware/authMiddleware');
const {PANPictureStorage,multer}=require('../services/multerService');
const upload=multer({storage:PANPictureStorage});
const PANDetailsValidator = require('../Validator/PANDetails');
const chatController = require ('../controller/chatController');


router.route('/organizationHome').get(authenticateUser.isAuthenticated,organizationController.renderOrganizationHome);

router.route('/createQuote').post(authenticateUser.isAuthenticated, organizationController.createQuote);

router.route('/profile').get(authenticateUser.isAuthenticated,organizationController.renderProfile);

router.route('/EditProfile').get(authenticateUser.isAuthenticated, organizationController.renderProfileEdit);

router.route('/VerifyPAN').get(authenticateUser.isAuthenticated,organizationController.renderVerifyOrganization).post(authenticateUser.isAuthenticated, upload.single('PANPic'),PANDetailsValidator, organizationController.enterPANDetails);

router.route('/createProgram').get(authenticateUser.isAuthenticated,organizationController.renderCreateProgram).post(authenticateUser.isAuthenticated, organizationController.createProgram);

router.route('/createdPrograms').get(authenticateUser.isAuthenticated,organizationController.renderCreatedProgram);

router.route('/deleteProgram/:programId').post(authenticateUser.isAuthenticated,organizationController.deleteProgram);

router.route("/edit/:programId").post(authenticateUser.isAuthenticated,organizationController.edit);

router.route('/updateProgram/:programId').post(authenticateUser.isAuthenticated,organizationController.updateProgram);

router.route('/updateProfile').post(upload.single('profilePic'), authenticateUser.isAuthenticated, organizationController.updateUser);

router.route('/OrganizationChat').get(authenticateUser.isAuthenticated, chatController.renderOrganizationChat);

module.exports = router;