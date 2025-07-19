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