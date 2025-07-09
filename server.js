// imports
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import noteRoutes from "./routes/noteRoutes.js";

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