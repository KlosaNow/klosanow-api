const express = require("express");
const proxy = require("express-http-proxy");

const router = express.Router();

router.use("/auth", proxy(`${process.env.BASE_URL}:${process.env.AUTH_PORT}`));
router.use("/user", proxy(`${process.env.BASE_URL}:${process.env.USER_PORT}`));

module.exports = router;
