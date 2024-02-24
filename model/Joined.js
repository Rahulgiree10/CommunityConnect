module.exports = (sequelize, DataTypes) => {
    const joined = sequelize.define("joined", {
        JoinedStatus: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'JOINED',
        },
        joinDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    });
    
    return joined;
};
