import crypto from 'crypto';
import OTP  from '../models/OTP';
import { UserTypes } from '../utils/types';

export const otpGenerator = async (userId: string): Promise<number> => {
  const otp = crypto.randomInt(1000, 10000);
  // const otpExists = await OTP.findOne({ otp, user: userId })
  const otpExists = false;
  return otpExists ? otpGenerator(userId) : otp;
};

export const authTokenGenerator = (length: number) => {
  return crypto.randomBytes(length).toString('hex')
};

export const createTokenUser = (user: UserTypes) => {
  return { name: user.name, userId: user._id, role: user.role };
};


