const mongoose = require("mongoose");
const User = require("./User");

const otpSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: "10m",
    default: Date.now,
  },
});

const authTokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: "120m", // two hours
    default: Date.now,
  },
});

const OTP = mongoose.model("OTP", otpSchema);
const AuthToken = mongoose.model("AuthToken", authTokenSchema);

module.exports = { OTP, AuthToken };
