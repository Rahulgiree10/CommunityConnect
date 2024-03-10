const db = require("../model/community");
const sendEmail = require("../services/emailService");


exports.renderAdminHome = async (req, res) => {
    const user = req.user;
    
    try {
        // Query to count the number of programs created on each date
        const programCounts = await db.program.findAll({
            attributes: [
                [db.Sequelize.fn('date', db.Sequelize.col('createdAt')), 'date'], // Extract date from createdAt field
                [db.Sequelize.fn('count', db.Sequelize.col('id')), 'count'] // Count number of programs
            ],
            group: [db.Sequelize.fn('date', db.Sequelize.col('createdAt'))],
            limit: 7, 
            raw: true // Get raw data
        });

        // Prepare data for chart
        const categories = programCounts.map(program => program.date);
        const seriesData = programCounts.map(program => program.count);

        console.log(categories)
        console.log(seriesData)

        // Render admin home page with data
        res.render("adminHome", { user: user, categories: categories, seriesData: seriesData });
    } catch (error) {
        console.error('Error fetching program data:', error);
        const message = req.flash();
        res.render("adminHome", { user: user, message: message });
    }
};



exports.renderadminProfile = async (req, res) => {
    const user = req.user;
    const message = req.flash();
    res.render("adminProfile", { user: user, message: message });
}

exports.renderAdminViewPAN = async (req, res) => {
    const user = await db.user.findAll({
        where: {
            userType: 'Organization',
        },
        include: {
            model: db.PAN,
            required: true // Use `required: true` to perform an INNER JOIN and include only users with PAN details 
        }
    });

    res.render("AdminVerifyPAN", { user: user });
}

exports.renderAdminVerifiedPAN = async (req, res) => {
    const user = await db.user.findAll({
        where: {
            userType: 'Organization',
        },
        include: {
            model: db.PAN,
            required: true // Use `required: true` to perform an INNER JOIN and include only users with PAN details 
        }
    });

    res.render("AdminVerifiedPAN", { user: user });
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
    res.render("AdminVerifyPANEach", { user: user });
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

// Route handler for removing a user
exports.removeVerification = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Fetch the user's email from the database based on userId
        const user = await db.user.findOne({
            where: { id: userId }
        });

        if (!user) {
            console.error('User not found');
            return res.redirect('/AdminViewVerifiedPAN');
        }

        // Update verification status of the user to 'PENDING'
        await db.user.update({ verification: 'PENDING' }, {
            where: { id: userId }
        });

        const options = {
            to: user.email, // Using the email fetched from the database
            text: 'Your organization details are under review. Please verify your organization again.',
            subject: 'Organization Verification Status Update'
        };

        // Sending the email
        await sendEmail(options);

        req.flash('success', 'Verification status updated successfully');
        return res.redirect('/AdminViewVerifiedPAN');
    } catch (error) {
        console.error('Error updating user verification status or sending email:', error);
        req.flash('error', 'An error occurred while updating verification status');
        return res.redirect('/AdminViewVerifiedPAN');
    }
};