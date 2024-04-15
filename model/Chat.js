module.exports = (sequelize, DataTypes) => {
    const chat = sequelize.define("chat", {
        GroupChatStatus: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: 'ACTIVE',
        }
    });
    
    return chat;
};
