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
const paymentRoutes = require ('./routes/paymentRoutes');
const cookieParser=require('cookie-parser');
const flash = require('connect-flash');
const schedule = require('node-schedule');
const { Op } = require('sequelize');


app.set("view engine", "ejs");

app.use(express.static(__dirname+ "/public"));
app.use(express.static(__dirname+ "/uploads/profilePicture"));
app.use(express.static(__dirname+ "/uploads/qr"));
app.use(express.static(__dirname+ "/uploads/PANPicture"));
app.use(express.static(__dirname+ "/uploads/document"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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

const task = schedule.scheduleJob('* * * * *', async function(){
  try {
    // Get current date and time
    const now = new Date();

    // Find programs with programDate smaller than current date and time
    const programsToUpdate = await db.program.findAll({
      where: {
        programDate: {
          [Op.lt]: now
        },
        programStatus: 'ACTIVE'
      }
    });

    // Update programStatus of found programs to 'INACTIVE'
    await Promise.all(programsToUpdate.map(async program => {
      await program.update({ programStatus: 'INACTIVE' });
    }));

    console.log('Program statuses updated successfully at', now);
  } catch (error) {
    console.error('Error updating program statuses:', error);
  }
});


app.use(userAuthRoutes);

app.use(organizationAuthRoutes);

app.use(memberAuthRoutes);

app.use(adminAuthRoutes);

app.use(paymentRoutes);

app.use("*", (req, res) => {
  return res.render("Errors/404Error");
});

//starting the server
app.listen(port, () => {
    console.log(`Click here: http://localhost:${port}`);
  });

