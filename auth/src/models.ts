import mongoose, { Types } from "mongoose";

interface IAuthToken {
  user: Types.ObjectId;
  token: string;
  createdAt: Date;
}

interface IOTP {
  user: Types.ObjectId;
  otp: number;
  createdAt: Date;
}

const authTokenSchema = new mongoose.Schema<IAuthToken>({
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

const otpSchema = new mongoose.Schema<IOTP>({
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

export const AuthToken = mongoose.model("AuthToken", authTokenSchema);
export const OTP = mongoose.model("OTP", otpSchema);
