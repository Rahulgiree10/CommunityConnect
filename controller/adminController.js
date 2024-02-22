const db = require("../model/community");

exports.renderAdminHome = async (req, res) => {
    const user = req.user;
    const message = req.flash();
    res.render("adminHome", { user: user, message:message });
}

exports.renderAdminViewPAN = async (req, res) => {
    const user = await db.user.findAll({
        where: {
            userType: 'Organization',
            verification: 'NOT VERIFIED' 
        },
        include: {
            model: db.PAN,
            required: true // Use `required: true` to perform an INNER JOIN and include only users with PAN details 
        }
    });

    res.render("AdminVerifyPAN", { user: user });
}

exports.renderEachAdminViewPAN = async (req, res) => {
    const userId = req.params.id;
    const user = await db.user.findOne({
        where: {
            id: userId
        },
        include: db.PAN
    });
    console.log(user.PAN.id);
    res.render("AdminVerifyPANEach", {user:user});
}

// Route handler to update verification status
exports.updateVerification = async (req, res) => {
    const userId = req.body.userId;
    console.log(userId);

    try {
        // Find the user by ID
        const user = await db.user.findByPk(userId);
        console.log(user);

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Update the verification status
        await user.update({ verification: 'VERIFIED' });
        req.flash('success', `${user.name} Successfully Verified`);

        res.redirect('/AdminHome'); // Redirect to home page or any other appropriate page
    } 
    catch (error) {
        // Handle errors
        console.error('Error updating verification status:', error);
        res.status(500).send('Internal Server Error');
    }
};
