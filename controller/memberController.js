const db = require("../model/community");

exports.renderMemberHome = async (req, res) => {
    const user = req.user;
    res.render("memberHome",{user:user});
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