const db = require("../model/community");

exports.renderAdminHome = async (req, res) => {
    res.render("adminHome");
}