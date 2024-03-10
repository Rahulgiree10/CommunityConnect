const db = require("../model/community");

exports.renderOrganizationChat = async (req, res) => {
    const user = req.user;
    res.render("Organizationchat", { user: user });
}