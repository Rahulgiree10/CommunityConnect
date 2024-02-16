const express = require("express");
const dotenv = require('dotenv');
const app = express();
const port = 4000;
const db = require("./model/community");
const session = require("express-session");
const userAuthRoutes = require ('./routes/userAuthRoutes');
const organizationAuthRoutes = require ('./routes/organizationAuthRoutes');
const memberAuthRoutes = require ('./routes/memberAuthRoutes');
const adminAuthRoutes = require ('./routes/adminAuthRoutes');
const cookieParser=require('cookie-parser');
const flash = require('connect-flash');


app.set("view engine", "ejs");

app.use(express.static(__dirname+ "/public"));
app.use(express.static(__dirname+ "/uploads/profilePicture"));
app.use(express.static(__dirname+ "/uploads/PANPicture"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

db.sequelize.sync({force:false});

app.use(
  session({
    secret: "abcdefghi",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());


dotenv.config();

app.use(userAuthRoutes);

app.use(organizationAuthRoutes);

app.use(memberAuthRoutes);

app.use(adminAuthRoutes);

//starting the server
app.listen(port, () => {
    console.log(`Click here: http://localhost:${port}`);
  });

