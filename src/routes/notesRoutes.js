const express = require("express");
const router = express.Router();
const authenticationMiddleware = require("../middlewares/authenticationMiddleware");
const noteController = require("../controllers/noteController");

// Middleware to ensure users are authenticated
router.use(authenticationMiddleware);

// Route to get all notes
router.get("/notes/", noteController.getAllNotes);

// Route to get a specific note with ID
router.get("/notes/:id", noteController.getNoteById);

// Route to create a new note
router.post("/notes/", noteController.createNote);

// Route to update a note with ID
router.put("/notes/:id", noteController.editNote);

// Route to delete a note with ID
router.delete("/notes/:id", noteController.deleteNote);

// Route to share a note with another user
router.post("/notes/:id/share", noteController.shareNote);

// Route for searching notes based on a query
router.get("/search", noteController.searchNotes);

module.exports = router;
