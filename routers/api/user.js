const express = require("express");
const { viewAllUsers, signUp, signIn } = require("../../controllers/user.js");
const router = express.Router();

router.route("/").get(viewAllUsers);

// Authentication endpoints
router.route("/auth/signUp").post(signUp);
router.route("/auth/signIn").post(signIn);

module.exports = router;
