import mongoose from 'mongoose';

const OTPSchema = new mongoose.Schema({
  otp: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const OTP = mongoose.model('OTP', OTPSchema)

export default OTP;