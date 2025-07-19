// middleware

// Import the Express.js framework to create a router module.
import express from "express";

// Create a new router object.
const router = express.Router();

// Define a middleware function to ensure the user is authenticated.
// Middleware functions are functions that have access to the request object (req), the response object (res),
// and the next middleware function in the application's request-response cycle (next).
function ensureAuthenticated(req, res, next) {
  // `req.isAuthenticated()` is a function provided by Passport.
  // It returns `true` if the user is authenticated (i.e., has an active session), and `false` otherwise.
  if (req.isAuthenticated()) {
    // If the user is authenticated, call `next()` to pass control to the next middleware or route handler in the stack.
    return next();
  }
  // If the user is not authenticated, send a 401 (Unauthorized) status and a JSON message.
  // This prevents access to the protected route.
  res.status(401).json({ message: "Unauthorized" });
}

// Define a GET route for '/profile'.
// The `ensureAuthenticated` middleware is applied to this route.
// This means `ensureAuthenticated` will run before the main route handler.
// If `ensureAuthenticated` calls `next()`, then the function `(req, res) => { ... }` will execute.
router.get("/profile", ensureAuthenticated, (req, res) => {
  // If the user is authenticated, `req.user` will contain the deserialized user information (e.g., from `passport.deserializeUser`).
  // We send back a JSON object containing the username.
  // Note: In passport-config.js, we set `done(null, { username: user.username })` in deserializeUser,
  // so `req.user` here will be an object like `{ username: 'the_actual_username' }`.
  console.log("Logged-in user", req.user);
  res.json({ username: req.user.username });
});

// Define another GET route, '/secure', also protected by the `ensureAuthenticated` middleware.
router.get("/secure", ensureAuthenticated, (req, res) => {
  // If authenticated, this route handler will execute.
  // It sends a simple text response indicating that this is a secure page.
  res.send("This is a secure page. Welcome, " + req.user.username + "!");
});

// Export the router so it can be imported and used in 'server.js'.
export default router;