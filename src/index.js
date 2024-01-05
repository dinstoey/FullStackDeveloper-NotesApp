const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/authRoutes");
const notesRoutes = require("./routes/notesRoutes");

const authenticationMiddleware = require("./middlewares/authenticationMiddleware");

const app = express();
const port = 3000;

// Rate limiting middleware to 5 requests per minute
// By limiting requests it prevents resource abuse or Dos Attack
const rateLimitMiddleware = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "You have exceeded your 5 requests per minute limit.",
  headers: true,
});

// Connect to MongoDB with the initialized username and password
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

// Routes to authentication endpoints
app.use("/api/auth", authRoutes);
// Routes to notes endpoints, going through the middleware used to protect the routes
app.use("/api", authenticationMiddleware, notesRoutes);

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
