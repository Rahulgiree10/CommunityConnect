module.exports = (sequelize, DataTypes) => {
    const Quote = sequelize.define("Quote", {
        detail: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        source: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
    
    return Quote;
};
