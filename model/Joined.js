module.exports = (sequelize, DataTypes) => {
    const joined = sequelize.define("joined", {
        JoinedStatus: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'JOINED',
        },
    });
    
    return joined;
};
