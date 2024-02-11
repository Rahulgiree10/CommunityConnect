const router = require ('express').Router();
const organizationController = require ('../controller/organizationController');
const authenticateUser=require('../middleware/authMiddleware');
const {PANPictureStorage,multer}=require('../services/multerService');
const upload=multer({storage:PANPictureStorage});


router.route('/organizationHome').get(authenticateUser.isAuthenticated,organizationController.renderOrganizationHome);

router.route('/profile').get(authenticateUser.isAuthenticated,organizationController.renderProfile);

router.route('/VerifyPAN').get(authenticateUser.isAuthenticated,organizationController.renderVerifyOrganization).post(authenticateUser.isAuthenticated, upload.single('PANPic'),organizationController.enterPANDetails);

module.exports = router;