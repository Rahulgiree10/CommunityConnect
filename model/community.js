const dbConfig = require("../config/db");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("CONNECTED!!");
  })
  .catch((err) => {
    console.log("Error" + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./userModel.js")(sequelize, DataTypes);
db.PAN = require("./PANModel.js")(sequelize, DataTypes);
db.program = require("./Program.js")(sequelize, DataTypes);
db.joined = require("./Joined.js")(sequelize, DataTypes);
db.Quote = require("./Quote.js")(sequelize, DataTypes);

//Relation between users and PAN
db.user.hasOne(db.PAN);
db.PAN.belongsTo(db.user);

//Relation between users and programs
db.user.hasMany(db.program);
db.program.belongsTo(db.user);

//Relation between users and joinedprogram table
db.user.hasMany(db.joined);
db.joined.belongsTo(db.user);

//Relation between programs and joinedprogram table
db.program.hasMany(db.joined);
db.joined.belongsTo(db.program);

module.exports = db;

