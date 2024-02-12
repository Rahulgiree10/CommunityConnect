const db = require("../model/community");
const userModel = require("../model/userModel");

exports.renderOrganizationHome = async (req, res) => {
    const user = req.user;
    res.render("organizationHome", { user: user });
}

exports.renderProfile = async (req, res) => {
    const user = req.user;
    res.render("OrganizationProfile", { user: user });
}

exports.renderVerifyOrganization = async (req, res) => {
    const user = req.user;
    res.render("verifyOrganization", { user: user });
}

exports.enterPANDetails = async (req, res) => {
    const user = req.user;
    try {
        const { PANNumber, PANName } = req.body;

        if (!req.file) {
            // Handle case where no file is uploaded
            return res.status(400).json({ error: "No file uploaded" });
        }

        const PANPic = req.file.filename;
        const userId = req.user.id;
        console.log(userId);

        // Check if PAN details already exist for the user
        const existingPAN = await db.PAN.findOne({ where: { userId: userId } });
        if (existingPAN) {
            // PAN details already exist for the user
            res.render("verifyOrganization", { user: user });
            return; // Return here to prevent further execution
        }
        

        // If PAN details don't exist, create a new PAN record
        const newPAN = await db.PAN.create({
            PANNumber,
            PANName,
            PANPic,
            userId: userId,
        });

        res.redirect("/organizationHome");
    }
    catch (error)
    {
        console.error("Error inserting PAN details:", error);
        // error message
        res.status(500).json({ error: "Internal server error" });
    }
}