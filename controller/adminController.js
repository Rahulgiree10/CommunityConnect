const { Op } = require('sequelize');
const db = require("../model/community");
const sendEmail = require("../services/emailService");


exports.renderAdminHome = async (req, res) => {
    const user = req.user;
    const totalprogram = await db.program.count({
        distinct: true,
        col: 'id'
    });
    const totalOrganizations = await db.user.count({
        where: {
            userType: 'Organization'
        }
    });
    const totalVerifiedOrganizations = await db.user.count({
        where: {
            userType: 'Organization',
            verification: "VERIFIED"
        }
    });
    const totalUsers = await db.user.count({});

    try {
        // Query to count the number of programs created on each date
        const programCounts = await db.program.findAll({
            attributes: [
                [db.sequelize.fn('date', db.sequelize.col('createdAt')), 'date'], // Extract date from createdAt field
                [db.sequelize.fn('count', db.sequelize.col('id')), 'count'] // Count number of programs
            ],
            group: [db.sequelize.fn('date', db.sequelize.col('createdAt'))],
            limit: 7,
            raw: true
        });

        // Prepare data for chart
        const categories = programCounts.map(program => program.date);
        const seriesData = programCounts.map(program => program.count);

        console.log(categories)
        console.log(seriesData)

        // Render admin home page with data
        res.render("adminHome", {
            user: user, categories: categories, seriesData: seriesData, totalprogram: totalprogram,
            totalOrganizations: totalOrganizations, totalVerifiedOrganizations: totalVerifiedOrganizations,
            totalUsers: totalUsers
        });
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

exports.renderEachAdminVerifiedPAN = async (req, res) => {
    const userId = req.params.id;
    const user = await db.user.findOne({
        where: {
            id: userId
        },
        include: db.PAN
    });
    console.log(user.PAN.id);
    res.render("AdminVerifiedPANEach", { user: user });
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

exports.renderViewDocument = async (req, res) => {
    const user = req.user;
    res.render("AdminViewDocument", { user: user });
};

exports.getDocumentsForDataTables = async (req, res) => {
    const { draw, start, length, order, search } = req.query;
    const startInt = parseInt(start) || 0;
    const lengthInt = parseInt(length) || 10;
    const options = {
        offset: startInt,
        limit: lengthInt,
        where: { fileStatus: 'PENDING' },
        order: [],
        include: [
            {
                model: db.program,
                attributes: ['programTitle'],
            },
            {
                model: db.user,
                attributes: ['name'],
            },
        ],
    };

    if (search && search.value) {
        options.where[Op.or] = [
            { programId: { [Op.like]: '%' + search.value + '%' } },
        ];
    }

    if (order && order.length > 0) {
        const column = parseInt(order[0].column);
        const dir = order[0].dir;
        const columnName = req.query.columns[column].data;
        options.order.push([columnName, dir]);
    }

    try {
        // Sequelize query to fetch the data
        const documents = await db.document.findAll(options);

        console.log(documents);
        // Get the total count of records (for pagination)
        const recordsTotal = await db.document.count();

        // Get the count of filtered records (for pagination)
        const recordsFiltered = await db.document.count({ where: options.where });

        res.json({
            draw: parseInt(draw),
            iTotalRecords: recordsTotal,
            iTotalDisplayRecords: recordsFiltered,
            aaData: documents,
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error appropriately
        res.status(500).json({ error: "Error fetching data" });
    }
};

exports.verifyDocument = async (req, res) => {
    const documentId = req.params.id;
    console.log(documentId);
    try {
        // Find the document
        const document = await db.document.findByPk(documentId);

        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        // Update the document's fileStatus to 'VERIFIED'
        await document.update({ fileStatus: 'VERIFIED' });

        console.log(document.programId)

        // Find the associated program
        const program = await db.program.findByPk(document.programId);

        if (!program) {
            console.error('Associated program not found');
            return res.status(404).json({ error: 'Associated program not found' });
        }

        // Update the program's status to 'COMPLETED'
        await program.update({ programStatus: 'COMPLETED' });

        // Find the users who joined this program
        const joinedUsers = await db.joined.findAll({ where: { programId: program.id } });

        // Update reward points for each joined user
        for (const joinedUser of joinedUsers) {
            const user = await db.user.findByPk(joinedUser.userId);
            if (user) {
                // Add 100 reward points to the user
                await user.update({ rewardPoints: user.rewardPoints + 100 });
            }
        }

        res.redirect("/AdminViewDocument");
    } catch (error) {
        console.error('Error verifying document:', error);
        res.status(500).json({ error: 'Error verifying document' });
    }
};

