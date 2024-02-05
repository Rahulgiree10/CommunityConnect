const router = require ('express').Router();
const adminController = require ('../controller/adminController');

router.route('/adminHome').get(adminController.renderAdminHome);

module.exports = router;