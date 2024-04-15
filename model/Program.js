module.exports = (sequelize, DataTypes) => {
    const Program = sequelize.define("program", {
        programTitle: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        programTime: {
            type: DataTypes.TIME, 
            allowNull: false,
        },
        programDate: {
            type: DataTypes.DATEONLY, 
            allowNull: false,
        },
        programLocation: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        programDescription: {
            type: DataTypes.TEXT, 
            allowNull: false,
        },
        programStatus: {
            type: DataTypes.STRING, 
            allowNull: false,
            defaultValue: 'ACTIVE'
        },
    });
    
    return Program;
};
