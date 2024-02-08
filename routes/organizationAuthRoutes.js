const router = require ('express').Router();
const organizationController = require ('../controller/organizationController');
const authenticateUser=require('../middleware/authMiddleware')

router.route('/organizationHome').get(authenticateUser.isAuthenticated,organizationController.renderOrganizationHome)

module.exports = router;