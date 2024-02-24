const router = require ('express').Router();
const memberController = require ('../controller/memberController');
const authenticateUser=require('../middleware/authMiddleware');

router.route('/memberHome').get(authenticateUser.isAuthenticated,memberController.renderMemberHome);

router.route('/memberProfile').get(authenticateUser.isAuthenticated,memberController.renderMemberProfile);

router.route('/joinProgram').get(authenticateUser.isAuthenticated,memberController.renderjoinProgram).post(authenticateUser.isAuthenticated,memberController.joinProgram);

router.route('/searchProgram').post(authenticateUser.isAuthenticated, memberController.searchProgram);

router.route('/joinedPrograms').get(authenticateUser.isAuthenticated, memberController.renderJoinedPrograms);

module.exports = router;