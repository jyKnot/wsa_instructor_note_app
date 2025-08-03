import mongoose from "mongoose";

const entrySchema = new mongoose.Schema({
    text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const noteSchema = new mongoose.Schema(
    {
        studentName: {
            type: String, 
            required: true, 
        },
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true, 
        },
        entries: [entrySchema],
        media: [{ type: String }] // we'll store image/video URLs or file paths here
    },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);

export default Note;