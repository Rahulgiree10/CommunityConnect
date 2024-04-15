module.exports = (sequelize, DataTypes) => {
    const document = sequelize.define("document", {
        file: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fileStatus: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "PENDING"
        }
    });
    
    return document;
};
