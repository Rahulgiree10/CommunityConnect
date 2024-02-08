const db = require("../model/community");

exports.renderOrganizationHome = async (req, res) => {
    const user=req.user;
    res.render("organizationHome",{user:user});
}
