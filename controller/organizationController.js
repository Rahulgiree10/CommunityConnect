const db = require("../model/community");

exports.renderOrganizationHome = async (req, res) => {
    res.render("organizationHome");
}
