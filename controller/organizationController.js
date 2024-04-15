const { currentLineHeight } = require("pdfkit");
const db = require("../model/community");
const userModel = require("../model/userModel");
const { validationResult } = require("express-validator");

exports.renderOrganizationHome = async (req, res) => {
    const user = req.user;
    res.render("organizationHome", { user: user });
}

// Assuming detail is part of the request body
exports.createQuote = async (req, res) => {
    const { detail, source } = req.body;

    try {
        const newQuote = await db.Quote.create({
            detail,
            source,
        });

        // Only send the redirect response if everything is successful
        res.redirect("/organizationHome");
    } catch (error) {
        // Log the error for debugging purposes
        console.error(error);

        // Send an error response
        res.status(500).send("Internal Server Error");
    }
};



exports.renderProfile = async (req, res) => {
    const user = await db.user.findOne({
        where: { id: req.user.id },
        include: {
            model: db.PAN // Assuming PAN details are associated with the user model
        }
    });
    res.render("OrganizationProfile", { user: user });
}

exports.renderProfileEdit = async (req, res) => {
    const user = req.user;
    res.render("ProfileEdit", { user: user });
}

// Controller function to update user's values
exports.updateUser = async (req, res) => {
    try {
        // Assuming you are using a form with inputs like name, email, password
        const { name, email, address } = req.body;
        let profilePic;

        // Check if a file was uploaded
        if (req.file) {
            profilePic = req.file.filename;
        }

        // Find the user by ID
        const user = await db.user.findOne({ where: { id: req.user.id } });

        if (!user) {
            // Handle case where user is not found
            return res.status(404).send("User not found");
        }

        // Update user's values
        user.name = name;
        user.email = email;
        user.address = address;
        if (profilePic) {
            user.profilePic = profilePic;
        }

        // Save the updated user
        await user.save();

        // Redirect to a page or send a response indicating success
        res.redirect('/profile');
    } catch (err) {
        console.error(err);
        // Handle errors appropriately
        res.status(500).send("Error updating user");
    }
};



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
            validationErrors: validationErrors,
            fData: fData,
            message: message
        });
}

//controller for verifying KYC details
exports.enterPANDetails = async (req, res) => {
    const user = req.user;
    const result = validationResult(req);

    if (!result.isEmpty()) {
        req.session.validationErrors = result.mapped();
        req.session.fData = req.body;
        res.redirect("/VerifyPAN");
        return;
    }

    try {
        const { PANNumber, PANName, OrganizationName, OrganizationType, OrganizationAddress, OrganizationContact } = req.body;

        if (!req.file) {
            req.flash('failure', `PAN Photo is not uploaded`);
            return res.redirect('/VerifyPAN');
        }

        const PANPic = req.file.filename;
        const userId = req.user.id;

        // Check if PAN details already exist for the user
        const existingPAN = await db.PAN.findOne({ where: { userId: userId } });

        if (existingPAN) {
            if (user.verification === 'NOT VERIFIED') {
                req.flash('failure', `Organization is already verified`);
                return res.redirect('/VerifyPAN');
            } else if (user.verification === 'PENDING') {
                // Replace existing PAN details
                await existingPAN.update({
                    PANNumber,
                    PANName,
                    OrganizationName,
                    OrganizationType,
                    OrganizationAddress,
                    OrganizationContact,
                    PANPic,
                });

                // Update user verification status to 'NOT VERIFIED'
                await user.update({ verification: 'NOT VERIFIED' });
            }
        } else {
            // If PAN details don't exist, create a new PAN record
            await db.PAN.create({
                PANNumber,
                PANName,
                OrganizationName,
                OrganizationType,
                OrganizationAddress,
                OrganizationContact,
                PANPic,
                userId: userId,
            });
        }

        req.flash('success', `PAN Details have been successfully updated`);
        res.redirect("/createProgram");
    }
    catch (error) {
        console.error("Error inserting PAN details:", error);
        // error message
        res.redirect('/VerifyPAN');
    }
}


exports.renderCreateProgram = async (req, res) => {
    const user = req.user;
    const message = req.flash();
    res.render("CreateProgram", { user: user, message: message });
}

//Controller to create the programs
exports.createProgram = async (req, res) => {
    const user = req.user;
    const userId = req.user.id;
    try {
        // Check if the user's verification status is 'VERIFIED'
        if (user.verification !== 'VERIFIED') {
            req.flash('failure', `Organization is not verified`);
            req.flash('warning', `Organization must be verified first`);
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

        // Create a chat record associated with the new program and the user
        await db.chat.create({
            programId: newProgram.id,
            userId: userId,
        });

        req.flash('success', `Program created successfully`);
        // res.status(200).json({ profilePic: profilePic });
        res.redirect("/createProgram");
    }
    catch (error) {
        console.error("Error creating program:", error);
        req.flash('failure', `Error creating program`);
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

exports.renderCompletedPrograms = async (req, res) => {
    try {
        const user = req.user;
        let program = await db.program.findAll();

        res.render("CompletedProgram", { user: user, program: program });
    } catch (error) {
        console.error("Error rendering completed programs:", error);
        // Handle error appropriately
        res.status(500).send("Error rendering completed programs");
    }
}



exports.submitDocument = async (req, res) => {
    const user = req.user;
    const programId = req.params.programId || req.query.programId || req.body.programId;
    console.log(programId);

    try {
        const program = await db.program.findOne({
            where: { id: programId }
        });

        if (!program) {
            console.error("Program not found");
            return res.redirect("/organizationHome");
        }

        if (!req.file) {
            console.error("No file attached");
            return res.redirect("/organizationHome");
        }

        const document = req.file.filename;
        console.log(document);

        const newDocument = await db.document.create({
            file: document,
            programId: programId,
            userId: user.id
        });

        res.redirect("/organizationHome")
    }
    catch (error) {
        console.error("Error creating document:", error);
        return res.redirect("/createdPrograms");
    }
};

exports.submitQr = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(userId);
        
        console.log(req.body)

        if (!req.file) {
            console.error("No file attached");
            return res.status(400).json({ error: "No file attached" });
        }

        const qrImage = req.file.filename;
        // console.log('The image of qr is', qrImage);

        const newQR = await db.payment.create({
            qrImage,
            userId:userId
        });

        res.redirect("/organizationHome")
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};