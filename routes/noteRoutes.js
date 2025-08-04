import express from "express";
import mongoose from "mongoose";
import Note from "../models/note.js";

const router = express.Router();

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

// GET all notes for the logged-in user
router.get("/", ensureAuthenticated, async (req, res) => {
  console.log('GET /api/notes req.user:', req.user);
  try {
    // Find notes for the current user (instructor or student)
    const userId = req.user && req.user._id ? req.user._id : req.user?.id;
    const notes = await Note.find({ instructor: userId });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notes", details: error.message });
  }
});


// POST Notes (create a note - student file) 
router.post("/", ensureAuthenticated, async (req, res) => {
    console.log('POST /api/notes req.user:', req.user);
    console.log('POST /api/notes body:', req.body);
    const { studentName, title, content } = req.body;
    try {
        // Use logged-in user as instructor
        const userId = req.user && req.user._id ? req.user._id : req.user?.id;
        const note = new Note({
            studentName,
            title,
            content,
            instructor: userId,
            entries: [],
            media: []
        });
        await note.save();
        res.status(201).json({ message: "Note created", note });
    } catch (err) {
        res.status(400).json({ message: "Note creation failed", error: err.message });
    }
});



// UPDATE Note by ID
router.put('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user && req.user._id ? req.user._id : req.user?.id;
    const note = await Note.findOneAndUpdate(
      { _id: noteId, instructor: userId },
      req.body,
      { new: true }
    );
    if (!note) {
      return res.status(404).json({ message: 'Note not found or not authorized' });
    }
    res.json({ message: 'Note updated', note });
  } catch (err) {
    res.status(400).json({ message: 'Note update failed', error: err.message });
  }
});

// DELETE Note by ID
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user && req.user._id ? req.user._id : req.user?.id;
    const result = await Note.deleteOne({ _id: noteId, instructor: userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Note not found or not authorized' });
    }
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Note deletion failed', error: err.message });
  }
});


export default router;