import mongoose from 'mongoose';
import { OTPType } from '../utils/types';

const OTPSchema = new mongoose.Schema<OTPType>(
  {
    otp: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const OTP = mongoose.model('OTP', OTPSchema);

export default OTP;
