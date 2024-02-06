const express = require("express");
const app = express();
const port = 4000;
const db = require("./model/community");
const session = require("express-session");
const userAuthRoutes = require ('./routes/userAuthRoutes');
const organizationAuthRoutes = require ('./routes/organizationAuthRoutes');
const memberAuthRoutes = require ('./routes/memberAuthRoutes');
const adminAuthRoutes = require ('./routes/adminAuthRoutes');


app.set("view engine", "ejs");

app.use(express.static(__dirname+ "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.sequelize.sync({force:false});

app.use(
  session({
    secret: "abcdefghi",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(userAuthRoutes);

app.use(organizationAuthRoutes);

app.use(memberAuthRoutes);

app.use(adminAuthRoutes);

//starting the server
app.listen(port, () => {
    console.log("Node server started at port 4000");
  });

