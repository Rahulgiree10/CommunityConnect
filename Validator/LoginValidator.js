const { check} = require("express-validator");

module.exports = 
[
    check('email')
    .trim()
    .not()
    .isEmpty()
    .withMessage("Email must be filled !"),

    check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password must be filled !"),

]
