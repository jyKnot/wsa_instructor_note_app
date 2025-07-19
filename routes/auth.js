// passport

// Import the Express.js framework, which we use to create router modules.
import express from "express";
// Import Passport, which we use for authenticating login requests.
import passport from "passport";
// Import the User model to interact with the user data in the database, e.g., for registration.
import User from "../models/user.js";

// Create a new router object. This allows us to define a set of routes in a separate file.
const router = express.Router();

// Define a POST route for user registration at '/register'.
// This is an asynchronous function because it interacts with the database.
router.post("/register", async (req, res) => {
  // Extract the username and password from the request body.
  // This assumes the client is sending a JSON object with 'username' and 'password' fields.
  const { username, password } = req.body;
  try {
    // Hash the user's password before storing it. This is a crucial security practice.
    // The 'hashPassword' method is assumed to be a static method on the User model.
    const hashedPassword = await User.hashPassword(password);
    // Create a new user instance with the username and the hashed password.
    const newUser = new User({ username, password: hashedPassword });
    // Save the new user to the database.
    await newUser.save();
    // If user creation is successful, send a 201 (Created) status and a success message.
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    // If there's an error (e.g., username already exists, database error), send a 400 (Bad Request) status and an error message.
    res.status(400).json({ message: "User not created", error: error.message });
  }
});

// Define a POST route for user login at '/login'.
// It uses Passport's 'authenticate' middleware with the 'local' strategy.
// The 'local' strategy is what we configured in 'passport-config.js' for username/password authentication.
router.post("/login", passport.authenticate("local"), (req, res) => {
  // If `passport.authenticate('local')` is successful, it calls the `done(null, user)` callback from our strategy.
  // Passport then attaches the user object to `req.user` and calls this route handler.
  // We send a JSON response indicating successful login.
  // The client can then use this to know the login was successful, and a session cookie is usually set automatically by `express-session` and Passport.
  res.json({
    message: "Login successful",
    user: { username: req.user.username },
  });
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
