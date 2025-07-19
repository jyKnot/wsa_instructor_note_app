// Import the main passport library, which is the core of our authentication system.
import passport from "passport";
// Import the LocalStrategy from passport-local. This strategy is used for username/password authentication.
import { Strategy as LocalStrategy } from "passport-local";
// Import the User model. This model represents our users in the database and has methods for finding users and validating passwords.
import User from "./models/user.js";

// Configure Passport to use the LocalStrategy.
// This function will be called when a user tries to log in.
passport.use(
  new LocalStrategy(async (username, password, done) => {
    // The 'username' and 'password' arguments come from the login form.
    // The 'done' argument is a callback function that we call when we're finished.
    try {
      // Try to find a user in the database with the provided username.
      const user = await User.findOne({ username });
      // If no user is found with that username...
      if (!user) {
        // ...call 'done' with 'null' (no error), 'false' (authentication failed), and a message.
        return done(null, false, { message: "Incorrect username" });
      }
      // If a user is found, check if the provided password is valid for that user.
      // The 'isValidPassword' method is usually defined in the User model.
      const isValid = await user.isValidPassword(password);
      // If the password is not valid...
      if (!isValid) {
        // ...call 'done' with 'null' (no error), 'false' (authentication failed), and a message.
        return done(null, false, { message: "Incorrect password" });
      }
      // If the username exists and the password is valid, authentication is successful.
      // Call 'done' with 'null' (no error) and the user object.
      return done(null, user);
    } catch (error) {
      // If any error occurs during this process (e.g., a database error)...
      // ...call 'done' with the error object.
      return done(error);
    }
  })
);

// Configure Passport to serialize the user.
// Serialization is the process of determining what data from the user object should be stored in the session.
// After a user logs in, Passport will call this function.
passport.serializeUser((user, done) => {
  // We'll store only the user's ID in the session. This keeps the session data small.
  // The 'done' callback is called with 'null' (no error) and the user's ID.
  done(null, user.id);
});

// Configure Passport to deserialize the user.
// Deserialization is the process of retrieving the user object from the session using the ID stored during serialization.
// On subsequent requests from a logged-in user, Passport will call this function with the ID from the session.
passport.deserializeUser(async (id, done) => {
  try {
    // Find the user in the database using the ID.
    const user = await User.findById(id);
    // Once the user is found, call 'done' with 'null' (no error) and an object containing the user's username.
    // This makes `req.user` available in our route handlers with the username.
    // You might choose to return the full user object or just specific parts of it.
    done(null, { username: user.username });
  } catch (error) {
    // If any error occurs (e.g., user not found or database error)...
    // ...call 'done' with the error object.
    done(error);
  }
});
