// routes/users.js
const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
  
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

// Login route
router.get("/login", (req, res) => {
  res.render("login", { message: "" });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      const message = info.message || "Invalid username or password";
      return res.render("login", { message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // Generation of a token
      const token = jwt.sign({ userId: user._id }, "sanwal123321", {
        expiresIn: '1m', 
      });
      console.log(token)
      // Set the token in a cookie
      res.cookie('token', token, { httpOnly: true });
      return res.redirect('/welcome');
    });
  })(req, res, next);
});

// Registration route
router.get("/register", (req, res) => {
  res.render("register", {
    message: "",
  });
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user) {
    return res.render("register", {
      message: "User already exists",
    });
  }

  if (!username || !password) {
    return res.render("register", {
      message: "Username and password are required.",
    });
  }

  const newUser = new User({ username, password });

  try {
    await newUser.save();
    console.log("User saved successfully");
    return res.redirect("/login");
  } catch (err) {
    console.error("Error saving user:", err.message);

    if (err.code === 11000) {
      return res.render("register", { message: "Username already exists." });
    }

    return res.render("register", {
      message: "An error occurred during registration.",
    });
  }
});

// Welcome page route
router.get("/welcome", isAuthenticated, (req, res) => {
  const username = req.user.username; 
  res.render("welcome", { username });
});

// Logout route
router.get("/logout", (req, res) => {
  res.clearCookie('token');
  res.redirect("/");
});

module.exports = router;
