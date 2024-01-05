const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

// Sign up a new user
router.post("/signup", authController.signup);

// Login
router.post("/login", authController.login);

module.exports = router;
