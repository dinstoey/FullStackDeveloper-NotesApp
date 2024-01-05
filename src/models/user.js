const mongoose = require("mongoose");

// Create a mongoose model for users
const User = mongoose.model("User", {
  username: String,
  password: String,
});

module.exports = User;
