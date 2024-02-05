const router = require ('express').Router();
const memberController = require ('../controller/memberController');

router.route('/memberHome').get(memberController.renderMemberHome);

module.exports = router;