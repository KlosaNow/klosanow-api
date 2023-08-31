import { badRequestError } from '../../utils/CustomError';
import User from '../../models/User';
import { Request, Response } from 'express';
import { successRes, transformPhone } from '../../helpers';

// import { attachCookiesToResponse } from '../../utils/jwt';
import { StatusCodes } from 'http-status-codes';
import sendOtpService from '../../services/otpService';
import { createJWT } from '../../utils/jwt';
import { generateRefreshToken } from '../../utils/jwt';
import Token from '../../models/Token';

const registerUser = async (req: Request, res: Response) => {
  const { email, name, phoneNumber, role } = req.body;

  if (!email || !name || !phoneNumber) {
    throw badRequestError('Please provide all required fields');
  }

  const phone = transformPhone(phoneNumber)

  const alreadyExists = await User.findOne({ email, phone });
  if (alreadyExists) {
    throw badRequestError(
      'User with that email or phone number already exists'
    );
  }

  const user = new User({ email, name, phoneNumber: phone, role });
  const otp = await sendOtpService(user._id, phone, email);

  const token = await createJWT({user})

  const existingToken = await Token.findOne({ user: user._id });

  const refreshToken = generateRefreshToken({user})
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    secure: true, // Set to true if using HTTPS
});

    
    // attachCookiesToResponse({ res, user: newUser });

  res
    .status(StatusCodes.CREATED)
    .json(successRes('User created successfully. OTP sent', { otp, token }));
};

export default registerUser;
 