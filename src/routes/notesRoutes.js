const express = require("express");
const router = express.Router();
const authenticationMiddleware = require("../middlewares/authenticationMiddleware");
const noteController = require("../controllers/noteController");

// Middleware to ensure authentication for all note routes
router.use(authenticationMiddleware);

// Route to get all notes
router.get("/", noteController.getAllNotes);

// Route to get a specific note by ID
router.get("/:id", noteController.getNoteById);

// Route to create a new note
router.post("/", noteController.createNote);

// Route to update a note by ID
router.put("/:id", noteController.editNote);

// Route to delete a note by ID
router.delete("/:id", noteController.deleteNote);

// Route to share a note with another user
router.post("/:id/share", noteController.shareNote);

// Route for searching notes based on a query
router.get("/search", noteController.searchNotes);

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const authenticationMiddleware = require("../middlewares/authenticationMiddleware");
// const noteController = require("../controllers/noteController");

// // Middleware to ensure authentication for all note routes
// router.use(authenticationMiddleware);

// // Route to get all notes

// // router.get("/api/notes", noteController.getAllNotes);
// router.get("/api/notes", (req, res) => {
//   console.log("Calling getAllNotes route...");
//   noteController.getAllNotes(req, res);
// });

// // Route to get a specific note by ID
// router.get("/api/notes/:id", noteController.getNoteById);

// // Route to create a new note
// router.post("/api/notes", noteController.createNote);

// // Route to update a note by ID
// router.put("/api/notes/:id", noteController.editNote);

// // Route to delete a note by ID
// router.delete("/api/notes/:id", noteController.deleteNote);

// // Route to share a note with another user
// router.post("/api/notes/:id/share", noteController.shareNote);

// // Route for searching notes based on a query
// router.get("/api/search", noteController.searchNotes);

// module.exports = router;
