const router = require ('express').Router();
const memberController = require ('../controller/memberController');
const authenticateUser=require('../middleware/authMiddleware');

router.route('/memberHome').get(authenticateUser.isAuthenticated,memberController.renderMemberHome);

router.route('/memberProfile').get(authenticateUser.isAuthenticated,memberController.renderMemberProfile);

router.route('/joinProgram').get(authenticateUser.isAuthenticated,memberController.renderjoinProgram);

module.exports = router;