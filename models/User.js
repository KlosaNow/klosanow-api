const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  notifications: [
    {
      type: String,
    },
  ],
  isTutor: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", userSchema);
