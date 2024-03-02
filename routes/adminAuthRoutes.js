const router = require ('express').Router();
const adminController = require ('../controller/adminController');
const authenticateUser=require('../middleware/authMiddleware');


router.route('/adminHome').get(authenticateUser.isAuthenticated,adminController.renderAdminHome);

router.route('/adminProfile').get(authenticateUser.isAuthenticated,adminController.renderadminProfile);

router.route('/AdminViewPAN').get(authenticateUser.isAuthenticated,adminController.renderAdminViewPAN);

router.route('/AdminViewVerifiedPAN').get(authenticateUser.isAuthenticated,adminController.renderAdminVerifiedPAN);

router.route('/AdminVerifyPANEach/:id').get(adminController.renderEachAdminViewPAN);

router.route('/AdminVerifyPANEach/:id/verify').post(authenticateUser.isAuthenticated, adminController.updateVerification);

router.route('/removePANDetails/:userId').post(authenticateUser.isAuthenticated, adminController.removeVerification); 


module.exports = router;