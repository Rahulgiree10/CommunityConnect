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
    catch (error) {
        console.error("Error inserting PAN details:", error);
        // error message
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.renderCreateProgram = async (req, res) => {
    const user = req.user;
    res.render("CreateProgram", { user: user });
}

exports.createProgram = async (req, res) => {
    const user = req.user;
    const userId = req.user.id;
    try {
        // Check if the user's verification status is 'VERIFIED'
        if (user.verification !== 'VERIFIED') {
            res.redirect('/createProgram');
            return;
        }
        // The program data is extracted from the request body
        const { programTitle, programTime, programDate, programLocation, programDescription } = req.body;

        const newProgram = await db.program.create({
            programTitle,
            programTime,
            programDate,
            programLocation,
            programDescription,
            userId: userId,
        });

        // res.status(200).json({ profilePic: profilePic });
        res.render("organizationHome", { user: user });
    }
    catch (error) {
        console.error("Error creating user:", error);
        // error message
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.renderCreatedProgram = async (req, res) => {
    const user = req.user;
    const program = await db.program.findAll();
    res.render("CreatedPrograms", { program: program, user: user });
}

exports.deleteProgram = async (req, res) => {
    const user = req.user;
    const deleteProgram = await db.program.destroy({
        where: {
            id: req.params.programId,
        }
    });
    const program = await db.program.findAll();
    res.render("CreatedPrograms", { program: program, user: user });
}

exports.edit = async (req, res) => {
    const user = req.user;
    const program = await db.program.findAll({
        where: {
            id: req.params.programId
        }
    });

    res.render("EditProgram", { program: program[0], user: user });
}

exports.updateProgram = async (req, res) => {

    const user = req.user;
    const userId = req.user.id;

    const { programTitle, programTime, programDate, programLocation, programDescription } = req.body;
    updatedData = {
        programTitle: programTitle,
        programTime: programTime,
        programDate: programDate,
        programLocation: programLocation,
        programDescription: programDescription,
        userId: userId,
    };


    await db.program.update(updatedData, { 
        where: {
            id: req.params.programId,
        },
    })

    const program = await db.program.findAll();
    res.render("CreatedPrograms", { program: program, user: user });
}