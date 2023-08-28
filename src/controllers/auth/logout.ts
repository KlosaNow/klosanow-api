import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CustomRequest } from '../../utils';
import Token from '../../models/Token';
import OTP from '../../models/OTP';
import { successRes } from '../../helpers';

const logout = async (req: CustomRequest, res: Response) => {
  const { user } = req;
  console.log('user', req.user)

  await Token.findOneAndDelete({ user: user._id });
  await OTP.findOneAndDelete({ user: user._id });

  res.cookie('accessToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.cookie('refreshToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json(successRes('Logged out successfully'));
};

export default logout;
