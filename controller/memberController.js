const db = require("../model/community");

exports.renderMemberHome = async (req, res) => {
    const user = req.user;
    const message = req.flash();
    res.render("memberHome",{user:user,message:message});
}

exports.renderMemberProfile = async (req, res) => {
    const user = req.user;
    res.render("MemberProfile",{user:user});
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

