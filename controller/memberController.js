const db = require("../model/community");

exports.renderMemberHome = async (req, res) => {
    const user = req.user;
    const message = req.flash();
    res.render("memberHome",{user:user,message:message});
}

exports.renderMemberProfile = async (req, res) => {
    const user = req.user;
    res.render("memberProfile",{user:user});
}

exports.renderjoinProgram = async (req, res) => {
    const user = req.user;
    const program = await db.program.findAll();

    res.render("joinProgram",{user:user, program:program});
}

// Controller function to handle program search
exports.searchProgram = async (req, res) => {
    try {
        const { programName } = req.query; // Extract the program name from the query parameters
        
        // Query the database for programs matching the search criteria
        const programs = await Program.find({ programTitle: { $regex: new RegExp(programName, 'i') } });
        
        // Send the matched programs as a response
        res.json(programs);
    } catch (error) {
        console.error('Error searching for programs:', error);
        res.status(500).json({ error: 'Failed to search for programs' });
    }
}

// Controller function to handle program search
exports.searchProgram = async (req, res) => {
    try {
        const { programName } = req.body; // Extracting the program name from the request body
        const { programLocation } = req.body; // Extracting the program location from the request body
        
        // Querying the database for programs matching the search criteria
        const programs = await db.program.findAll({
            where: {
                programTitle: { [db.Sequelize.Op.like]: `%${programName}%`},            
                programLocation: { [db.Sequelize.Op.like]: `%${programLocation}%`},            
            }
        });
        
        const user = req.user;
        res.render("joinProgram", { user: user, program: programs });
    } catch (error) {
        console.error('Error searching for programs:', error);
        return res.redirect('/joinProgram');
    }
};

// Controller function to handle joining a program
exports.joinProgram = async (req, res) => {
    try {
        const { programId } = req.body; // Extracting the program ID from the request body
        const userId = req.user.id; // Assuming you have the user ID available in req.user
        console.log(programId, userId)
        // Check if the user is already a member of the program
        const existingMembership = await db.joined.findOne({
            where: {
                programId: programId,
                userId: userId
            }
        });

        if (existingMembership) {
            // If the user is already a member, redirect with a message indicating so
            req.flash('error', 'You are already a member of this program.');
            return res.redirect('/joinProgram');
        }

        // If the user is not already a member, create a new membership
        await db.joined.create({
            programId: programId,
            userId: userId
        });

        // Redirect to a success page or display a success message
        return res.redirect('/joinProgram'); // Redirect to the dashboard or any other appropriate page
    } catch (error) {
        console.error('Error joining program:', error);
        return res.redirect('/joinProgram');
    }
};

// Controller function to render the page displaying joined programs
exports.renderJoinedPrograms = async (req, res) => {
    try {
        // Get the ID of the current user
        const userId = req.user.id;
        const user = req.user;

        // Query the database to fetch joined programs for the current user
        const joinedPrograms = await db.joined.findAll({
            where: { 
                UserId: userId 
            },
            include: 
            {
                model:db.program,
                required: true
            } 
        });

        console.log(joinedPrograms);

        // Render the view with the fetched joined programs
        res.render("joinedProgram", { joinedPrograms , user:user});
    } catch (error) {
        console.error('Error fetching joined programs:', error);
        return res.redirect('/joinedPrograms'); // Redirect to home page or handle error as needed
    }
};