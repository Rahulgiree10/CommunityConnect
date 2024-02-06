const { ENUM } = require ('sequelize'); 
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userType: {
            type: ENUM('Organization','Member','Admin'),
            allowNull: false,
        },
        profilePic: {
            type: DataTypes.STRING,
        },
        otp: {
            type: DataTypes.INTEGER,
            allowNull:true,
        },
    });
    
    return User;
};