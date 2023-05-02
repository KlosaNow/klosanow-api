import { badRequestError } from '../utils/CustomError';
import User from '../models/User';
import { Request, Response } from 'express';
import { successRes, tokenGenerator } from '../helpers';

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

  await sendOtpService(newUser._id, phoneNumber);

  attachCookiesToResponse({ res, user: newUser });

  res
    .status(StatusCodes.OK)
    .json(successRes('User created successfully. OTP sent'));
};

export default registerUser;
