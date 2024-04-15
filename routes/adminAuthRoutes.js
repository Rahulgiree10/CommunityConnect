const router = require ('express').Router();
const adminController = require ('../controller/adminController');
const authenticateUser=require('../middleware/authMiddleware');
const {checkUserType} = require('../middleware/checkUserTypeMiddleware');


router.route('/adminHome').get(authenticateUser.isAuthenticated, checkUserType("Admin"), adminController.renderAdminHome);

router.route('/adminProfile').get(authenticateUser.isAuthenticated, checkUserType("Admin"), adminController.renderadminProfile);

router.route('/AdminViewPAN').get(authenticateUser.isAuthenticated, checkUserType("Admin"), adminController.renderAdminViewPAN);

router.route('/AdminViewVerifiedPAN').get(authenticateUser.isAuthenticated, checkUserType("Admin"), adminController.renderAdminVerifiedPAN);

router.route('/AdminVerifyPANEach/:id').get(authenticateUser.isAuthenticated, checkUserType("Admin"), adminController.renderEachAdminViewPAN);

router.route('/AdminVerifyPANEach/:id/verify').post(authenticateUser.isAuthenticated, adminController.updateVerification);

router.route('/AdminVerifiedPANEach/:id').get(authenticateUser.isAuthenticated, checkUserType("Admin"), adminController.renderEachAdminVerifiedPAN);

router.route('/removePANDetails/:userId').post(authenticateUser.isAuthenticated, adminController.removeVerification); 

router.route('/AdminViewDocument').get(authenticateUser.isAuthenticated, checkUserType("Admin"), adminController.renderViewDocument); 

router.route('/fetchDocumentsForDataTables').get(authenticateUser.isAuthenticated, checkUserType("Admin"), adminController.getDocumentsForDataTables);

router.route('/verifyDocument/:id').get(authenticateUser.isAuthenticated, checkUserType("Admin"), adminController.verifyDocument);

module.exports = router;