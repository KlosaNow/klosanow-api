import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CustomRequest } from '../../utils';
import { debugLog } from '../../server';
import OTP from '../../models/OTP';
import Token from '../../models/Token';
import { badRequestError } from '../../utils/CustomError';
import { tokenGenerator } from '../../helpers';
import { attachCookiesToResponse } from '../../utils/jwt';

const verifyOTP = async (req: CustomRequest, res: Response) => {
  const { otp } = req.body;
  const { user } = req;

  const otpExists = await OTP.findOne({ user: user._id, otp });

  if (!otpExists || !otpExists?.otp) {
    throw badRequestError('Invalid OTP');
  }
  otpExists.otp = 0;
  await otpExists.save();

  const refreshToken = tokenGenerator(32);
  const ip = req.ip;
  const userAgent = req.headers['user-agent'];
  
  await Token.deleteMany({ user: user._id });

  const token = await Token.create({
    refreshToken,
    ip,
    userAgent,
    user: user._id,
    otpVerified: true,
  });
  await token.save()
  attachCookiesToResponse({ res, user, refreshToken: token.refreshToken });
  await OTP.deleteMany({ user: user._id });

  debugLog({ otpExists, user, token });
  res
    .status(StatusCodes.OK)
    .json({ status: 'OTP Verified Successfully', token });
};

export default verifyOTP;
