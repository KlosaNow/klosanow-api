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
  notifications: [
    {
      type: String,
    },
  ],
  isTutor: {
    type: Boolean,
    default: false,
  },
  createdlessons: {
    type: Array,
  },
  savedLessons: {
    type: Array,
  },
  subscriptionId: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "Subscription",
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
