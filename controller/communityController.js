const db = require("../model/community");
const bcrypt = require('bcrypt');

//logic for landing page
exports.index = async (req, res) => {
  res.render("welcome");
};

exports.renderLogin = async (req, res) => {
  res.render("login");
};

exports.renderSignup = async (req, res) => {
  res.render("signup");
}

//logic for storing data which is used while signing up and rendering to login page
exports.signup = async (req, res) => {
  try {
    // The user data is extracted from the request body
    const { email, password, name, address, userType, profilePic } = req.body;

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
  } catch (error) {
    console.error("Error creating user:", error);
    // error message
    res.status(500).json({ error: "Internal server error" });
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