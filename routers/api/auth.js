const express = require("express");
const { signUp, signIn } = require("../../controllers/auth");
const {
  requiredFieldsValidator,
  emailValidator,
  phoneNumberValidator,
} = require("../../helpers/validators");
const router = express.Router();

router
  .route("/sign-up")
  .post(requiredFieldsValidator, emailValidator, phoneNumberValidator, signUp);
router.route("/sign-in").post(signIn);

module.exports = router;
