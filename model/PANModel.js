module.exports = (sequelize, DataTypes) => {
    const PAN = sequelize.define("PAN", {
        PANNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        PANName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        PANPic: {
            type: DataTypes.STRING,
        },
    });
    
    return PAN;
};