import sendOtpService from '../services/otpService';
import User from '../models/User';
import { badRequestError } from '../utils/CustomError';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Token from '../models/Token';
import { attachCookiesToResponse } from '../utils/jwt';
import { authTokenGenerator } from '../helpers';

const loginUser = async (req: Request, res: Response) => {
  const { email, phoneNumber } = req.body;

  if (!email || !phoneNumber) {
    throw badRequestError('Please provide all required fields');
  }

  const user = await User.findOne({ email, phoneNumber });
  if (!user) {
    throw badRequestError(
      'User with that email or phone number does not exist'
    );
  }

  const existingToken = await Token.findOne({ user: user._id });
  if (existingToken) {
    const { refreshToken } = existingToken;
    existingToken.otpVerified = true;
    await existingToken.save();
    const otp = await sendOtpService(user._id);

    attachCookiesToResponse({ res, user, refreshToken });

    return res
      .status(StatusCodes.OK)
      .json({ status: 'Logged in successfully', existingToken, otp });
  }

  const refreshToken = authTokenGenerator(32);
  const ip = req.ip;
  const userAgent = req.headers['user-agent'];

  const token = await Token.create({
    refreshToken,
    ip,
    userAgent,
    user: user._id,
  });

  const otp = await sendOtpService(user._id);

  attachCookiesToResponse({ res, user, refreshToken });

  res.status(StatusCodes.OK).json({ status: 'OTP sent successfully', otp, token });
};

export default loginUser;
