import express from "express";
import mongoose from "mongoose";
import Note from "../models/note.js";

const router = express.Router();

// GET Notes (get notes) 
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find(); // or maybe filter by instructor
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notes", details: error.message });
  }
});


// POST Notes (create a note - student file) 
router.post("/", async (req, res) => {
    const { studentName } = req.body;
    try {
        const note = new Note({
            studentName,
            instructor: new mongoose.Types.ObjectId("000000000000000000000001"),
            entries: [],
            media: []
        });
        await note.save();
        res.status(201).json({ message: "Note created", note });
    } catch (err) {
        res.status(400).json({ message: "Note creation failed", error: err.message });
    }
});



// UPDATE Notes 



//  DELETE Notes


export default router;