//import authentication controller
const express = require("express");
const authController = require("../controllers/authController");

// Create a router instance
const router = express.Router();

// Sign up a new user
router.post("/signup", authController.signup);

// Login a user
router.post("/login", authController.login);

module.exports = router;
