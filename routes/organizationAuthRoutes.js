const router = require ('express').Router();
const { or } = require('sequelize');
const organizationController = require ('../controller/organizationController');
const authenticateUser=require('../middleware/authMiddleware');
const {PANPictureStorage, documentStorage, qrStorage, multer}=require('../services/multerService');
const upload=multer({storage:PANPictureStorage});
const uploadDocument=multer({storage:documentStorage});
const uploadQR = multer({storage:qrStorage});
const PANDetailsValidator = require('../Validator/PANDetails');
const chatController = require ('../controller/chatController');
const {checkUserType} = require('../middleware/checkUserTypeMiddleware');



router.route('/organizationHome').get(authenticateUser.isAuthenticated, checkUserType("Organization"), organizationController.renderOrganizationHome);

router.route('/createQuote').post(authenticateUser.isAuthenticated, organizationController.createQuote);

router.route('/profile').get(authenticateUser.isAuthenticated, checkUserType("Organization"), organizationController.renderProfile).post(authenticateUser.isAuthenticated, uploadQR.single('qr'), organizationController.submitQr);

router.route('/EditProfile').get(authenticateUser.isAuthenticated, checkUserType("Organization"), organizationController.renderProfileEdit);

router.route('/VerifyPAN').get(authenticateUser.isAuthenticated, checkUserType("Organization"), organizationController.renderVerifyOrganization).post(authenticateUser.isAuthenticated, upload.single('PANPic'),PANDetailsValidator, organizationController.enterPANDetails);

router.route('/createProgram').get(authenticateUser.isAuthenticated, checkUserType("Organization"), organizationController.renderCreateProgram).post(authenticateUser.isAuthenticated, organizationController.createProgram);

router.route('/createdPrograms').get(authenticateUser.isAuthenticated, checkUserType("Organization"), organizationController.renderCreatedProgram);

router.route('/deleteProgram/:programId').post(authenticateUser.isAuthenticated, organizationController.deleteProgram);

router.route("/edit/:programId").post(authenticateUser.isAuthenticated, organizationController.edit);

router.route('/updateProgram/:programId').post(authenticateUser.isAuthenticated,organizationController.updateProgram);

router.route('/updateProfile').post(upload.single('profilePic'), authenticateUser.isAuthenticated, organizationController.updateUser);

router.route('/OrganizationChat').get(authenticateUser.isAuthenticated, checkUserType("Organization"), chatController.renderChat);

router.route('/addMessage').post(authenticateUser.isAuthenticated, chatController.addMessage);

router.route('/completedPrograms').get(authenticateUser.isAuthenticated, checkUserType("Organization"), organizationController.renderCompletedPrograms);

router.route('/submitDocument').post(authenticateUser.isAuthenticated, uploadDocument.single('file'), organizationController.submitDocument);

module.exports = router;