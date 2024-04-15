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
        OrganizationName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        OrganizationType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        OrganizationAddress: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        OrganizationContact: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        PANPic: {
            type: DataTypes.STRING,
        },
    });
    
    return PAN;
};