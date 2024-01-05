const mongoose = require("mongoose");

// Create a mongoose model for notes
const NoteSchema = new mongoose.Schema({
  owner: mongoose.Schema.Types.ObjectId,
  shared_with: [mongoose.Schema.Types.ObjectId],
  title: String,
  text: String,
});

NoteSchema.index({ title: "text", text: "text" });

const Note = mongoose.model("note", NoteSchema);

module.exports = Note;
