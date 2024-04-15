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

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import models
db.user = require("./userModel.js")(sequelize, DataTypes);
db.PAN = require("./PANModel.js")(sequelize, DataTypes);
db.program = require("./Program.js")(sequelize, DataTypes);
db.joined = require("./Joined.js")(sequelize, DataTypes);
db.Quote = require("./Quote.js")(sequelize, DataTypes);
db.chat = require("./Chat.js")(sequelize, DataTypes);
db.message = require("./message.js")(sequelize, DataTypes);
db.document = require("./document.js")(sequelize, DataTypes);
db.payment = require("./payment.js")(sequelize, DataTypes);

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

//Relation between chat and program table
db.program.hasMany(db.chat);
db.chat.belongsTo(db.program);

//Relation between chat and user table
db.user.hasMany(db.chat);
db.chat.belongsTo(db.user);

//Relation between message and program table
db.program.hasMany(db.message);
db.message.belongsTo(db.program);

//Relation between message and user table
db.user.hasMany(db.message);
db.message.belongsTo(db.user);

//Relation between message and program table
db.program.hasMany(db.document);
db.document.belongsTo(db.program);

//Relation between message and user table
db.user.hasMany(db.document);
db.document.belongsTo(db.user);

//Relation between message and user table
db.user.hasMany(db.payment);
db.payment.belongsTo(db.user);

module.exports = db;
