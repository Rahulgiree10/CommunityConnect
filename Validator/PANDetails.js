const { check} = require("express-validator");

module.exports = 
[
    check('PANNumber')
    .trim()
    .not()
    .isEmpty()
    .withMessage("PAN number must be filled !"),

    check('PANName')
    .trim()
    .not()
    .isEmpty()
    .withMessage("PAN name must be filled !"),

    check('OrganizationName')
    .trim()
    .not()
    .isEmpty()
    .withMessage("Organization Name must be filled !"),

    check('OrganizationType')
    .trim()
    .not()
    .isEmpty()
    .withMessage("Organization type must be filled !"),

    check('OrganizationAddress')
    .trim()
    .not()
    .isEmpty()
    .withMessage("Organization address must be filled !"),

    check('OrganizationContact')
    .trim()
    .not()
    .isEmpty()
    .withMessage("Organization contact must be filled !"),
]