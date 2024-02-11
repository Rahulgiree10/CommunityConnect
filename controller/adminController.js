const db = require("../model/community");

exports.renderAdminHome = async (req, res) => {
    const user = req.user;
    res.render("adminHome", { user: user });
}

exports.renderAdminViewPAN = async (req, res) => {
    const user = await db.user.findAll({
        where: {
            userType: 'Organization'
        },
        include: {
            model: db.PAN,
            required: true // Use `required: true` to perform an INNER JOIN and include only users with PAN details 
        }
    });

    res.render("AdminVerifyPAN", { user: user });
}

exports.renderEachAdminViewPAN = async (req, res) => {
    res.render("AdminVerifyPANEach");
}