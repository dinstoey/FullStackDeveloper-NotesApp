const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/authRoutes");
const notesRoutes = require("./routes/notesRoutes");

const authenticationMiddleware = require("./middlewares/authenticationMiddleware");

const app = express();
const port = 3000;

// Rate limiting middleware
const rateLimitMiddleware = rateLimit({
  windowMs: 60 * 1000,
  max: 1000,
  message: "You have exceeded your 2 requests per minute limit.",
  headers: true,
});

// Connect to MongoDB
mongoose.connect(
  "mongodb://uname:pass@localhost:27017/notesdb?authSource=admin",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Middleware
app.use(rateLimitMiddleware);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(authenticationMiddleware);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/search", notesRoutes);

// Start the server
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Close the Mongoose connection when the application exits
process.on("exit", () => {
  mongoose.connection.close(() => {
    console.log("Mongoose connection closed.");
  });
});

module.exports = { app, server };

// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const setRateLimit = require("express-rate-limit");

// //rate limiting middleware to 5 max per miniute
// const rateLimitMiddleware = setRateLimit({
//   windowMs: 60 * 1000,
//   max: 5,
//   message: "You have exceeded your 2 requests per minute limit.",
//   headers: true,
// });

// const app = express();
// app.use(rateLimitMiddleware);
// const port = 3000;

// mongoose.connect(
//   "mongodb://uname:pass@localhost:27017/notesdb?authSource=admin",
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   }
// );

// const NoteSchema = new mongoose.Schema({
//   owner: mongoose.Schema.Types.ObjectId,
//   shared_with: [mongoose.Schema.Types.ObjectId],
//   title: String,
//   text: String,
// });

// // Add text indexing on the title and text fields
// NoteSchema.index({ title: "text", text: "text" });

// const Note = mongoose.model("note", NoteSchema);

// // Create a mongoose model for users
// const User = mongoose.model("User", {
//   username: String,
//   password: String,
// });

// // Middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// // Routes

// // Sign up a new user
// app.post("/api/auth/signup", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     console.log(req.body);
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ username, password: hashedPassword });
//     await newUser.save();
//     res.status(200).json({ message: "User registered successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Login
// app.post("/api/auth/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });

//     if (!user) {
//       return res.status(401).json({ error: "Invalid username or password" });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid) {
//       return res.status(401).json({ error: "Invalid username or password" });
//     }

//     const token = jwt.sign({ userId: user._id }, "secret_key");
//     res.json({ token });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Protected route - require token for access
// app.use((req, res, next) => {
//   const token = req.headers.authorization;

//   if (!token) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }

//   jwt.verify(token, "secret_key", (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }

//     req.userId = decoded.userId;
//     next();
//   });
// });

// // CRUD routes with authentication

// // Get all notes
// app.get("/api/notes", async (req, res) => {
//   //get user from request
//   //query all notes that are owned by this user
//   try {
//     const user_id = req.userId;
//     const notes = await Note.find({ shared_with: user_id });
//     const result = notes.map(display_note);
//     res.status(200).json(result);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get one note
// app.get("/api/notes/:id", async (req, res) => {
//   //get user from request
//   //query all notes that are owned by this user
//   try {
//     const user_id = req.userId;
//     const note_id = new mongoose.Types.ObjectId(req.params.id);

//     const note = await Note.findOne({
//       $and: [{ shared_with: user_id }, { _id: note_id }],
//     });

//     if (!note) {
//       res.status(404).json({
//         error: "Not found",
//       });
//       return;
//     }
//     const result = display_note(note);
//     res.status(200).json(result);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Create New Note
// app.post("/api/notes", async (req, res) => {
//   //post user from request
//   //query all notes that are owned by this user
//   try {
//     const user_id = req.userId;

//     const { title, text } = req.body;
//     const result = await Note.create({
//       text: text,
//       title: title,
//       owner: user_id,
//       shared_with: [user_id],
//     });
//     //await note.find({ shared_with: user_id });
//     res.status(200).json({ id: result._id });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Edit a note
// // Create New Note
// app.put("/api/notes/:id", async (req, res) => {
//   //post user from request
//   //query all notes that are owned by this user
//   try {
//     const user_id = req.userId;
//     const note_id = new mongoose.Types.ObjectId(req.params.id);

//     const note = await Note.findOne({
//       $and: [{ owner: user_id }, { _id: note_id }],
//     });

//     if (!note) {
//       res.status(404).json({
//         error: "Not found",
//       });
//       return;
//     }

//     const { title, text } = req.body;
//     const result = await Note.updateOne(
//       { _id: note_id },
//       {
//         text: text,
//         title: title,
//       }
//     );

//     res.status(200).json({ message: "Successfully updated." });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Delete a note
// app.delete("/api/notes/:id", async (req, res) => {
//   //get user from request
//   //query all notes that are owned by this user
//   //select the note with the id and deletes it
//   try {
//     const user_id = req.userId;
//     const note_id = new mongoose.Types.ObjectId(req.params.id);

//     const result = await Note.deleteOne({
//       $and: [{ owner: user_id }, { _id: note_id }],
//     });

//     if (result.deletedCount === 0) {
//       res.status(404).json({
//         error: "Not found",
//       });
//       return;
//     }
//     res.status(200).json({ message: "Successfully Deleted." });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Share with other users endpoint
// app.post("/api/notes/:id/share", async (req, res) => {
//   //get OTHER user id from body
//   //select the note owned by this user
//   //update the note by adding the user_id to the sharewith list
//   try {
//     const user_id = req.userId;
//     const note_id = new mongoose.Types.ObjectId(req.params.id);

//     const note = await Note.findOne({
//       $and: [{ owner: user_id }, { _id: note_id }],
//     });

//     if (!note) {
//       res.status(404).json({
//         error: "Not found",
//       });
//       return;
//     }

//     let { newuser_id } = req.body;
//     shared_id = new mongoose.Types.ObjectId(newuser_id);
//     console.log("User ID to share with:", newuser_id);
//     const result = await Note.updateOne(
//       { _id: note_id },
//       { $addToSet: { shared_with: shared_id } }
//     );

//     res.status(200).json({ message: "Successfully added." });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// //search with query

// // Get all notes
// app.get("/api/search", async (req, res) => {
//   //get user from request
//   //query all notes that are owned by this user
//   //select those with the keyword in the query (with case sensetive)
//   try {
//     const user_id = req.userId;
//     const query = req.query.q;

//     // const notes = await Note.find({
//     //   $and: [
//     //     { shared_with: user_id },
//     //     {
//     //       $or: [
//     //         { title: { $regex: query } }, // Case-sensitive search on title
//     //         { text: { $regex: query } }, // Case-sensitive search on text
//     //       ],
//     //     },
//     //   ],
//     // });
//     const notes = await Note.find({
//       $and: [{ shared_with: user_id }, { $text: { $search: query } }],
//     });
//     const result = notes.map(display_note);
//     res.status(200).json(result);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// function display_note(note) {
//   return {
//     id: note._id,
//     title: note.title,
//     text: note.text,
//   };
// }

// // Start the server
// const server = app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

// // Close the Mongoose connection when the application exits
// process.on("exit", () => {
//   mongoose.connection.close(() => {
//     console.log("Mongoose connection closed.");
//   });
// });

// module.exports = { app, server }; // exporting both app and server
