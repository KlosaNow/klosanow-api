import { badRequestError } from '../utils/CustomError';
import User from '../models/User';
import { Request, Response } from 'express';
import { tokenGenerator } from '../helpers';
import Token from '../models/Token';
import { attachCookiesToResponse } from '../utils/jwt';
import { StatusCodes } from 'http-status-codes';
import sendOtpService from '../services/otpService';

const registerUser = async (req: Request, res: Response) => {
  const { email, name, phoneNumber } = req.body;

  if (!email || !name || !phoneNumber) {
    throw badRequestError('Please provide all required fields');
  }

  const alreadyExists = await User.findOne({ email, phoneNumber });
  if (alreadyExists) {
    throw badRequestError(
      'User with that email or phone number already exists'
    );
  }

  const newUser = await User.create({ email, name, phoneNumber });
  
  // create and save auth token
  const refreshToken = tokenGenerator(32);
  const ip = req.ip;
  const userAgent = req.headers['user-agent'];

  const token = await Token.create({ refreshToken, ip, userAgent, user: newUser._id });

  const otp = await sendOtpService(newUser._id);

  attachCookiesToResponse({ res, user: newUser, refreshToken });
  
  res.status(StatusCodes.OK).json({ status: 'User created successfully', token, otp });
};

export default registerUser;
