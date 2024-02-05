const db = require("../model/community");

exports.renderMemberHome = async (req, res) => {
    res.render("memberHome");
}
