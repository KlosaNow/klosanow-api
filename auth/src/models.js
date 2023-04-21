const mongoose = require("mongoose");

const authTokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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

const otpSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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

const AuthToken = mongoose.model("AuthToken", authTokenSchema);
const OTP = mongoose.model("OTP", otpSchema);

module.exports = { OTP, AuthToken };
