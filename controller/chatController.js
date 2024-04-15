const db = require("../model/community");

exports.renderChat = async (req, res) => {
    try {
        const user = req.user;
        // Retrieve the programId from the query parameters
        const programId = req.query.programId;
        console.log(programId)

        // Fetch the details of the specific program using the programId
        const program = await db.program.findOne({
            where: { id: programId },
            include: [
                {
                    model: db.chat,
                    include: {
                        model: db.user,
                    }
                },
                {
                    model: db.message, 
                    include: {
                        model: db.user,
                    },
                    where: {
                        programId: programId 
                    }
                }
            ]
        });

        // Check if program is null
        if (!program) {
            const program = await db.program.findOne({
                where: { id: programId },
                include: [
                    {
                        model: db.chat,
                        include: {
                            model: db.user,
                        }
                    },
                ]
            });

            res.render("chatO", { user: user, program: program });
        }

        // Render the chatO view with the user and program data
        res.render("chatO", { user: user, program: program });
    } catch (error) {
        console.error("Error rendering chat page:", error);
        res.status(500).send("Internal Server Error");
    }
};



exports.renderJoinedChat = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch all chats for the user
        const chats = await db.chat.findAll({
            where: { userId: userId },
            include: [{
                model: db.program,
                where: {
                    programStatus: 'ACTIVE'
                },
            }]
        });

        // Iterate over each chat and log its associated program's title
        chats.forEach(chat => {
            if (chat.program) { // Check if chat has an associated program
                console.log(chat.program.programTitle);
            } else {
                console.log("Chat has no associated program.");
            }
        });

        // Render the JoinedChat view, passing the fetched chats
        res.render("JoinedChat", { chats: chats });
    } catch (error) {
        console.error("Error rendering joined chat:", error);
        res.status(500).send("An error occurred while rendering the joined chat.");
    }
};


exports.joinChatMember = async (req, res) => {
    try {
        const userId = req.user.id;
        const programId = req.params.programId;

        // Fetch the program details along with associated chats
        const program = await db.program.findByPk(programId, {
            include: {
                model: db.chat,
                include: {
                    model: db.user,
                }
            }
        });

        // Create a new chat entry for the member in the program
        await db.chat.create({
            programId: programId,
            userId: userId,
        });

        // Render the MemberChat view with the program details
        res.redirect("/joinedChat");
    } catch (error) {
        console.error("Error joining chat as member:", error);
        res.status(500).send("An error occurred while joining the chat.");
    }
};


exports.renderMemberChatIndividual = async (req, res) => {
    try {
        const user = req.user;
        const { programId } = req.query;

         // Fetch the details of the specific program using the programId
         const program = await db.program.findOne({
            where: { id: programId },
            include: [
                {
                    model: db.chat,
                    include: {
                        model: db.user,
                    }
                },
                {
                    model: db.message, 
                    include: {
                        model: db.user,
                    },
                    where: {
                        programId: programId 
                    }
                }
            ]
        });

        // Check if program is null
        if (!program) {
            const program = await db.program.findOne({
                where: { id: programId },
                include: [
                    {
                        model: db.chat,
                        include: {
                            model: db.user,
                        }
                    },
                ]
            });
            res.render("MemberChat", { user: user, program: program });
        }

        // Once you have fetched the required data, render the MemberChat view with the data
        res.render("MemberChat", { user:user ,program: program });
    } catch (error) {
        console.error("Error rendering MemberChat:", error);
        res.status(500).send("An error occurred while rendering the MemberChat.");
    }
};


exports.addMessage = async (req, res) => {
    try {
        const user = req.user;
        const {userId, messageText, programId} = req.body;
        

        // Insert the message into the database
        const message = await db.message.create({
            chatMessage: messageText,
            programId: programId,
            userId: userId
        });
        
        // Fetch the details of the specific program using the programId
        const program = await db.program.findOne({
            where: { id: programId },
            include: [
                {
                    model: db.chat,
                    include: {
                        model: db.user,
                    }
                },
                {
                    model: db.message, 
                    include: {
                        model: db.user,
                    },
                    where: {
                        programId: programId 
                    }
                }
            ]
        });

        res.render("chatO", { user: user, program: program });
        } catch (error) {
        console.error("Error adding message:", error);
        res.status(500).json({ error: "An error occurred while adding the message" });
    }
};

exports.addMemberMessage = async (req, res) => {
    try {
        const user = req.user;
        const userId = req.user.id;
        const {messageText, programId} = req.body;
        console.log(userId);
        

        // Insert the message into the database
        const message = await db.message.create({
            chatMessage: messageText,
            programId: programId,
            userId: userId
        });
        
        // Fetch the details of the specific program using the programId
        const program = await db.program.findOne({
            where: { id: programId },
            include: [
                {
                    model: db.chat,
                    include: {
                        model: db.user,
                    }
                },
                {
                    model: db.message, 
                    include: {
                        model: db.user,
                    },
                    where: {
                        programId: programId 
                    }
                }
            ]
        });

        res.render("MemberChat", { user: user, program: program });
        } catch (error) {
        console.error("Error adding message:", error);
        res.status(500).json({ error: "An error occurred while adding the message" });
    }
};