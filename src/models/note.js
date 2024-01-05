const mongoose = require("mongoose");

// Create a schema for Note
const NoteSchema = new mongoose.Schema({
  owner: mongoose.Schema.Types.ObjectId,
  shared_with: [mongoose.Schema.Types.ObjectId],
  title: String,
  text: String,
});

// Create a schema with  a text index for searching through both text and title attributes
NoteSchema.index({ title: "text", text: "text" });

// Create a mongoose model for Note, based on the NoteSchema
const Note = mongoose.model("note", NoteSchema);

// Export Note Model
module.exports = Note;
