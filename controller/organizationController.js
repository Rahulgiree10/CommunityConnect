const db = require("../model/community");
const userModel = require("../model/userModel");
const { validationResult } = require("express-validator");

exports.renderProfile = async (req, res) => {
    const user = req.user;
    res.render("OrganizationProfile", { user: user });
}

exports.renderVerifyOrganization = async (req, res) => {
    const validationErrors = req.session.validationErrors || [];
    const fData = req.session.fData || {};
    const message = req.flash();

    delete req.session.validationErrors;
    delete req.session.fData;
    const user = req.user;

    res.render("verifyOrganization", 
    { 
        user: user,
        validationErrors:validationErrors,
        fData:fData,
        message:message
    });
}

exports.enterPANDetails = async (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        req.session.validationErrors = result.mapped();
        req.session.fData = req.body;
        res.redirect("/VerifyPAN");
        return;
    }

    try {
        const { PANNumber, PANName } = req.body;

        if (!req.file) {
            req.flash('failure',`PAN Photo is not uploaded`);
            return res.redirect('/VerifyPAN');
        }

        const PANPic = req.file.filename;
        const userId = req.user.id;
        console.log(userId);

        // Check if PAN details already exist for the user
        const existingPAN = await db.PAN.findOne({ where: { userId: userId } });
        if (existingPAN) {
            req.flash('failure',`Organization is already verified`);
            res.redirect('/VerifyPAN');
            return; // Return here to prevent further execution
        }


        // If PAN details don't exist, create a new PAN record
        const newPAN = await db.PAN.create({
            PANNumber,
            PANName,
            PANPic,
            userId: userId,
        });

        req.flash('success',`PAN Details is successfully submitted`);
        res.redirect("/createProgram");
    }
    catch (error) {
        console.error("Error inserting PAN details:", error);
        // error message
        res.redirect('/VerifyPAN');
        return;
    }
}

exports.renderCreateProgram = async (req, res) => {
    const user = req.user;
    const message = req.flash();
    res.render("CreateProgram", { user: user, message:message});
}

exports.createProgram = async (req, res) => {
    const user = req.user;
    const userId = req.user.id;
    try {
        // Check if the user's verification status is 'VERIFIED'
        if (user.verification !== 'VERIFIED') {
            req.flash('failure',`Organization is not verified`);
            req.flash('warning',`Organization must be verified first`);
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

        req.flash('success',`Program created successfully`);
        // res.status(200).json({ profilePic: profilePic });
        res.redirect("/createProgram");
    }
    catch (error) {
        console.error("Error creating program:", error);
        req.flash('failure',`Error creating program`);
        return res.redirect('/createProgram');
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