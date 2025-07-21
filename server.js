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
app.use("/api", noteRoutes); 




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
      // `secure: true` ensures the cookie is only sent over HTTPS. This should be true in production.
      // It's set based on the NODE_ENV environment variable.
      secure: process.env.NODE_ENV === "production",
      // `maxAge` sets the maximum age of the cookie in milliseconds (here, 7 days).
      // After this time, the cookie (and session) will expire.
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      // `sameSite: 'strict'` helps protect against CSRF (Cross-Site Request Forgery) attacks
      // by restricting when the browser sends the cookie.
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

app.use("/auth", authRoutes);

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
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Route to serve secure.html at /secure
app.get('/secure', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'secure.html'));
});

// Route to serve profile.html at /profile
app.get('/profile', (req, res) => {
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