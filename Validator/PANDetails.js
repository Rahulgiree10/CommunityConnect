const { check} = require("express-validator");

module.exports = 
[
    check('PANNumber')
    .trim()
    .not()
    .isEmpty()
    .withMessage("PAN Number must be filled !"),

    check('PANName')
    .trim()
    .not()
    .isEmpty()
    .withMessage("PAN Name must be filled !"),
]