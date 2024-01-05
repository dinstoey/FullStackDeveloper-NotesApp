const mongoose = require("mongoose");
const Note = require("../models/note");

// Get all notes
exports.getAllNotes = async (req, res) => {
  try {
    const user_id = req.userId;
    const notes = await Note.find({ shared_with: user_id });
    const result = notes.map(display_note);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get one note
exports.getNoteById = async (req, res) => {
  try {
    const user_id = req.userId;
    const note_id = new mongoose.Types.ObjectId(req.params.id);

    const note = await Note.findOne({
      $and: [{ shared_with: user_id }, { _id: note_id }],
    });
    // Not not found
    if (!note) {
      res.status(404).json({
        error: "Not found",
      });
      return;
    }
    const result = display_note(note);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create New Note
exports.createNote = async (req, res) => {
  try {
    const user_id = req.userId;
    const { title, text } = req.body;
    const result = await Note.create({
      text: text,
      title: title,
      owner: user_id,
      shared_with: [user_id],
    });
    res.status(200).json({ id: result._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Edit a note
exports.editNote = async (req, res) => {
  try {
    const user_id = req.userId;
    const note_id = new mongoose.Types.ObjectId(req.params.id);
    // fast searching with Mongoose's -in text indexing for
    const note = await Note.findOne({
      $and: [{ owner: user_id }, { _id: note_id }],
    });
    // not not found
    if (!note) {
      res.status(404).json({
        error: "Not found",
      });
      return;
    }

    const { title, text } = req.body;
    const result = await Note.updateOne(
      { _id: note_id },
      {
        text: text,
        title: title,
      }
    );

    res.status(200).json({ message: "Successfully updated." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    const user_id = req.userId;
    const note_id = new mongoose.Types.ObjectId(req.params.id);

    const result = await Note.deleteOne({
      $and: [{ owner: user_id }, { _id: note_id }],
    });

    if (result.deletedCount === 0) {
      res.status(404).json({
        error: "Not found",
      });
      return;
    }
    res.status(200).json({ message: "Successfully Deleted." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Share with other users endpoint
exports.shareNote = async (req, res) => {
  try {
    const user_id = req.userId;
    const note_id = new mongoose.Types.ObjectId(req.params.id);

    const note = await Note.findOne({
      $and: [{ owner: user_id }, { _id: note_id }],
    });

    if (!note) {
      res.status(404).json({
        error: "Not found",
      });
      return;
    }

    let { newuser_id } = req.body;
    shared_id = new mongoose.Types.ObjectId(newuser_id);
    console.log("User ID to share with:", newuser_id);
    const result = await Note.updateOne(
      { _id: note_id },
      { $addToSet: { shared_with: shared_id } }
    );

    res.status(200).json({ message: "Successfully added." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all notes based on search query
exports.searchNotes = async (req, res) => {
  try {
    console.log("search notes done");
    const user_id = req.userId;
    const query = req.query.q;
    console.log("Search query:", query);
    // querying the text index for a fast search
    const notes = await Note.find({
      $and: [{ shared_with: user_id }, { $text: { $search: query } }],
    });
    const result = notes.map(display_note);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// function which selects id, title, and text only from a note for viewing purposes
function display_note(note) {
  return {
    id: note._id,
    title: note.title,
    text: note.text,
  };
}
