module.exports = (sequelize, DataTypes) => {
    const message = sequelize.define("message", {
        chatMessage: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    });
    
    return message;
};
