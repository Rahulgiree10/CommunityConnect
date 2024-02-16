const db = require("../model/community");
const bcrypt = require('bcrypt');
const sendEmail = require("../services/emailService");
const jwt=require('jsonwebtoken');
const { text } = require("express");
const session = require('express-session');
const dotenv=require('dotenv');
const { validationResult } = require("express-validator");
dotenv.config();


exports.renderRoot= async (req,res)=>{
  const user=req.authenticatedUser;
  
  console.log(user)
  if(user && user.userType=='organization'){
    res.redirect('/homepage')
  }
  else if(user && user.role=='admin'){
    res.redirect('/example')
  }else{
    res.redirect('/')
  }
}


//logic for landing page
exports.index = async (req, res) => {
  res.render("Welcome");
};

exports.AboutUs = async(req, res) => {
  res.render("AboutUs");
}

exports.ContactUs = async(req, res) => {
  res.render("ContactUs");
}

exports.renderLogin = async (req, res) => {
  res.render("login");
};

exports.renderSignup = async (req, res) => {
  const signupErrors = req.session.signupErrors || [];
  const fData = req.session.fData || {};
  const message = req.flash();

  delete req.session.signupErrors;
  delete req.session.fData;
  res.render("signup",{
    message:message,
    signupErrors: signupErrors,
    fData: fData,
  });
}

//logic for storing data which is used while signing up and rendering to login page
exports.signup = async (req, res) => {
  const result = validationResult(req);
    
  if (!result.isEmpty()) 
  {
    req.session.signupErrors = result.mapped();
    req.session.fData = req.body;
    res.redirect("/signup");
  } 
  else 
  {
    try {
      // The user data is extracted from the request body
      const { email, password, name, address, userType  } = req.body;
  
      if (!req.body.profilePic) {
        // Handle case where no file is uploaded
        return res.redirect("signup");
      }
  
      
      const profilePic = req.file.filename;
  
      const encPassword = bcrypt.hashSync(password, 10);
      console.log(encPassword);
  
  
      const newUser = await db.user.create({
        email,
        password: encPassword,
        name,
        address,
        userType,
        profilePic,
      });
  
      res.render("login");
    } 
    catch (error) {
      console.error("Error creating user:", error);
      req.flash('failure',`Error creating user`);
      return res.res.render("signup",{message:message});
    }
  }
};

// Logic for logging in, using user credentials and according to the type of the user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(password);
    // Find the user by email in the database
    const foundUser = await db.user.findOne({
      where: { email: email },
    });

    if (foundUser) {
      if (bcrypt.compareSync(password, foundUser.password)) {
        var token = jwt.sign({ id: foundUser.id }, process.env.JWT_SECRET_KEY, {
          expiresIn: 86400,
        });

        console.log(token)
        res.cookie("token", token);

        req.flash('success',`Successfully Logged In by ${foundUser.name}`);
        // Login the user according to the type of the user
        if (foundUser.userType === "Organization") {
          return res.redirect("/organizationHome");
        } else if (foundUser.userType === "Member") {
          return res.redirect("/memberHome");
        } else if (foundUser.userType === "Admin") {
          return res.redirect("/adminHome");
        } else {
          // If the user type is not one of the expected options
          return res.redirect("/");
        }
      }
    }

  } catch (error) {
    console.error("Error during login:", error);
    // Error message
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.logout= async(req, res)=>{
  res.clearCookie("token")
  res.redirect("/login")
}


exports.renderForgotPassword = (req, res) => {
  res.render("OTPSend");
};


exports.verifyEmail = async (req, res) => {
  const { email } = req.body;
  
  const foundUser = await db.user.findOne({
    where: {
      email: email,
    },
  });

  if (!foundUser) {
    console.log("Email is not registered yet");
    res.redirect("OTPSend");
    return;
  }

  console.log("Email is registered");
  try {
    req.session.userEmail = email;

    const OTP = Math.floor(100000 + Math.random() * 900000);
    const message = "Your OTP is: " + OTP + ".";

    const options={
      to: email,
      text: message,
      subject: "Reset password",
    }

    await sendEmail(options);

    foundUser.otp = OTP;

    await foundUser.save();
    res.render("OTPEnter");

  } catch (e) {
    console.log("Error in sending the email.");
    console.log(e.message);
    res.render("OTPSend", { error: "Error sending email. Please try again later." });
  }
};



exports.renderOTPSend = (req, res) => {
  res.render("OTPEnter");
};


exports.verifyOTP = async (req, res) => {
  const { otp } = req.body;
  const email= req.session.userEmail;
  console.log(email);
  const foundUser = await db.user.findOne({
    where: {
      email:email,
    },
  });

  if (foundUser!=null &&foundUser.otp==otp) {
    res.redirect("/resetPassword");
  }
  else{
    res.redirect("/OTPVerify")
  }
};


exports.renderEnterNewPassword = (req, res) => {
  res.render("EnterNewPassword");
};

exports.resetPassword= async (req,res)=>{
  const {newPassword,confirmNewPassword}=req.body
  const email= req.session.userEmail;

  if (newPassword!=confirmNewPassword){
    res.redirect("/resetPassword")
  }
  else{
    const foundUser= await db.user.findOne({
      where:{
        email:email
      }
    })
      const encPassword=bcrypt.hashSync(newPassword,10)
      console.log(encPassword);
      foundUser.password = encPassword;
      foundUser.otp = null;
      foundUser.save();
      delete req.session.userEmail;
      res.redirect('/login')
  }
}