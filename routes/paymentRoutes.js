const router=require('express').Router()
const paymentController=require('../controller/paymentController');
const authenticateUser=require('../middleware/authMiddleware');
const {checkUserType} = require('../middleware/checkUserTypeMiddleware');

router.route('/payment/initiate').post(authenticateUser.isAuthenticated, checkUserType("Member") ,paymentController.initializeKhaltiPayment);

module.exports=router; 