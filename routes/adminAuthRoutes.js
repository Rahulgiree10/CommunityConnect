const router = require ('express').Router();
const adminController = require ('../controller/adminController');
const authenticateUser=require('../middleware/authMiddleware');


router.route('/adminHome').get(authenticateUser.isAuthenticated,adminController.renderAdminHome);

router.route('/AdminViewPAN').get(authenticateUser.isAuthenticated,adminController.renderAdminViewPAN)

router.route('/AdminVerifyPANEach').get(adminController.renderEachAdminViewPAN);

module.exports = router;