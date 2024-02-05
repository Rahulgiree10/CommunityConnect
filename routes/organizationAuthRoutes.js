const router = require ('express').Router();
const organizationController = require ('../controller/organizationController');
const { checkAuth } = require('../middleware/authMiddleware');

router.route('/organizationHome').get(organizationController.renderOrganizationHome);

module.exports = router;