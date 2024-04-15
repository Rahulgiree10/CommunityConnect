module.exports = (sequelize, DataTypes) => {
    const payment = sequelize.define("payment", {
        qrImage: {
            type: DataTypes.STRING,
        }
    });
    
    return payment;
};
