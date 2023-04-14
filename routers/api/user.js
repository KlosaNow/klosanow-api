const express = require("express");
const { viewAllUsers } = require("../../controllers/user.js");
const router = express.Router();

router.route("/").get(viewAllUsers);

module.exports = router;
