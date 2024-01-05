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
