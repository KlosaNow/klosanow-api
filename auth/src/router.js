const express = require("express");
const { signUp, signIn, verifyUser } = require("./controllers");
const {
  requiredFieldsValidator,
  emailValidator,
  phoneNumberValidator,
} = require("./helpers");
const router = express.Router();

router
  .route("/sign-up")
  .post(requiredFieldsValidator, emailValidator, phoneNumberValidator, signUp);
router.route("/sign-in").post(signIn);
router.route("/verify-user/:authToken").post(verifyUser);

module.exports = router;
