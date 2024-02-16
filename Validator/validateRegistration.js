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

    check('name')
    .trim()
    .not()
    .isEmpty()
    .withMessage("Name must be filled !"),

    check('address')
    .trim()
    .not()
    .isEmpty()
    .withMessage("Address must be filled !"),

    check('userType')
    .trim()
    .not()
    .isEmpty()
    .withMessage("Type of User must be filled !")
    .not()
    .equals("Signup As")
    .withMessage("Incident Type must be filled !"),
]