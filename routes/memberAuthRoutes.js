const router = require ('express').Router();
const memberController = require ('../controller/memberController');
const authenticateUser=require('../middleware/authMiddleware');
const chatController = require ('../controller/chatController');
const { chat } = require('../model/community');
const {checkUserType} = require('../middleware/checkUserTypeMiddleware');


router.route('/memberHome').get(authenticateUser.isAuthenticated, checkUserType("Member"), memberController.renderMemberHome);

router.route('/memberProfile').get(authenticateUser.isAuthenticated, checkUserType("Member"), memberController.renderMemberProfile);

router.route('/memberEditProfile').get(authenticateUser.isAuthenticated, checkUserType("Member"), memberController.renderMemberProfileEdit);

router.route('/joinProgram').get(authenticateUser.isAuthenticated, checkUserType("Member"), memberController.renderjoinProgram).post(authenticateUser.isAuthenticated,memberController.joinProgram);

router.route('/searchProgram').post(authenticateUser.isAuthenticated, memberController.searchProgram);

router.route('/joinedPrograms').get(authenticateUser.isAuthenticated, checkUserType("Member"), memberController.renderJoinedPrograms);

router.route('/joinChat/:programId').get(authenticateUser.isAuthenticated, checkUserType("Member"), chatController.joinChatMember);

router.route('/joinedChat').get(authenticateUser.isAuthenticated, checkUserType("Member"), chatController.renderJoinedChat);

router.route('/individualChat').get(authenticateUser.isAuthenticated, checkUserType("Member"), chatController.renderMemberChatIndividual);

router.route('/addMemberMessage').post(authenticateUser.isAuthenticated, chatController.addMemberMessage);


module.exports = router