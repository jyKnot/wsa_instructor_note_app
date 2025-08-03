// passport


import express from "express";
import passport from "passport";
import User from "../models/user.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new router object. This allows us to define a set of routes in a separate file.
const router = express.Router();

// Define a POST route for user registration at '/register'.
// This is an asynchronous function because it interacts with the database.
router.post("/register", async (req, res) => {
  // Extract the username and password from the request body.
  // This assumes the client is sending a JSON object with 'username' and 'password' fields.
  const { firstName, lastName, username, password, email, role } = req.body;
  try {
    // Hash the user's password before storing it. This is a crucial security practice.
    // The 'hashPassword' method is assumed to be a static method on the User model.
    const hashedPassword = await User.hashPassword(password);
    // Create a new user instance with the username and the hashed password.
    const newUser = new User({ 
        firstName,
        lastName,
        username, 
        password: hashedPassword,
        email,
        role,
 });
    // Save the new user to the database.
    await newUser.save();
    req.logIn(newUser, (err) => {
      if (err) {
        return res.status(500).json({ message: "Login after registration failed", error: err.message });
      }
      res.redirect("/dashboard");
    });
  } catch (error) {
    res.status(400).json({ message: "Registration failed", error: error.message });
  }
});


// Login user
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    req.logIn(user, (err) => {
      if (err) return next(err);
      res.redirect("/dashboard");
    });
  })(req, res, next);
});

// LOGOUT User
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed", error: err.message });
    res.json({ message: "Logout successful" });
  });
});


router.post("/register", async (req, res) => {
  const { firstName, lastName, username, password, email, role } = req.body;

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Hash password and create user
    const hashedPassword = await User.hashPassword(password);
    const newUser = new User({
      firstName,
      lastName,
      username,
      password: hashedPassword,
      email,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(400).json({ message: "Registration failed", error: error.message });
  }
});

// Define a GET route for user register at '/register'.
router.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/register.html"));
});


// /dashboard
router.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/dashboard.html"));
});


// Define a GET route for user logout at '/logout'.

router.get("/logout", (req, res) => {
  // `req.logout()` is a function provided by Passport to terminate a login session.
  // It removes the `req.user` property and clears the login session (if any).
  req.logout((err) => {
    // The callback function for `req.logout()` receives an error object if something goes wrong.
    if (err) {
      // If there's an error during logout, send a 500 (Internal Server Error) status and an error message.
      return res
        .status(500)
        .json({ message: "Logout failed", error: err.message });
    }
    // If logout is successful, redirect the user to the homepage (or any other appropriate page).
    res.redirect("/index.html"); // Assuming index.html is your public homepage
  });
});

// Export the router so it can be imported and used in 'server.js'.
export default router;


