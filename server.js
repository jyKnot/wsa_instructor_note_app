// imports

import express from "express";
import path from "path";
import passport from "passport";
import session from "express-session";
import mongoose from "mongoose";
import "./passport-config.js"; // Note: We are importing this for its side effects (configuring Passport).
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import protectedRoutes from "./routes/protected.js";
import noteRoutes from "./routes/noteRoutes.js";
import { fileURLToPath } from "url";


// configure .env file

dotenv.config();

// db connection

mongoose.connect(process.env.LOCAL_MONGOOSE_CONNECTION_URL);
const db = mongoose.connection;


mongoose.connect(process.env.LOCAL_MONGOOSE_CONNECTION_URL)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err.message);
  });

// server

const app = express();

app.use(express.json());
app.use(express.static("public"));



function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); //  They're logged in — allow access
  }
  res.redirect("/login"); //  Not logged in — send them to login
}



// Configure the express-session middleware.

app.use(
  session({
    // `secret` is used to sign the session ID cookie. It should be a long, random string kept secret.
    // It uses the SESSION_SECRET environment variable or a default fallback key.
    secret: process.env.SESSION_SECRET || "your_secret_key",
    // `resave: false` means the session will not be saved back to the session store
    // if it was never modified during the request. This can help prevent race conditions.
    resave: false,
    // `saveUninitialized: false` means that a session that is new but not modified will not be saved.
    // This is useful for reducing server storage usage and complying with cookie laws.
    saveUninitialized: false,
    cookie: {
      secure: false, // Always false for localhost development
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: "strict",
    },
  })
);

app.use(express.urlencoded({ extended: true }));


// Initialize Passport middleware. This is essential for Passport to work.
app.use(passport.initialize());
// Enable Passport to use sessions. This allows users to stay logged in across requests.
// This middleware must be used after `express-session`.
app.use(passport.session());


app.use("/api/notes", noteRoutes);
app.use("/auth", authRoutes);
app.use("/protected", protectedRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Needed to resolve __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static assets (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve login.html at /login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Route to serve dashboard.html at /dashboard
app.get('/dashboard', ensureAuthenticated,(req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Route to serve secure.html at /secure
app.get('/secure', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'secure.html'));
});

// Route to serve profile.html at /profile
app.get('/profile', ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

// Route to serve logout.html at /logout
app.get('/logout', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'logout.html'));
});

// Route to serve register.html at /register
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

passport.deserializeUser((id, done) => {
  console.log('deserializeUser called with id:', id);
  User.findById(id)
    .then(user => {
      console.log('deserializeUser found user:', user);
      done(null, user);
    })
    .catch(err => done(err));
});