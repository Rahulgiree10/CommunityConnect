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
        verification: {
            type: DataTypes.ENUM('NOT VERIFIED', 'VERIFIED', 'PENDING'),
            allowNull: false,
            defaultValue: 'NOT VERIFIED'
        },
        rewardPoints: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    });
    
    return User;
};