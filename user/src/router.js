const express = require("express");
const { getUsers, getUserByEmail, createUser } = require("./controllers");
const router = express.Router();

router.route("/").get(getUsers).post(createUser);
router.route("/:emailAddress").get(getUserByEmail);

module.exports = router;
