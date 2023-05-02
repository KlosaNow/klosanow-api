import { Request, Response, NextFunction } from 'express';
import { verifyJWT, CustomRequest } from '../utils';
import Token from '../models/Token';
import { unAuthorizedError } from '../utils/CustomError';
import { attachCookiesToResponse } from '../utils/jwt';

const authenticateUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { accessToken, refreshToken } = req.signedCookies;

  console.log(accessToken, refreshToken)

  if (accessToken) {
    const payload = verifyJWT(accessToken);
    req.user = payload.user;
    return next();
  }
  const payload = verifyJWT(refreshToken);
  const existingToken = await Token.findOne({
    refreshToken: payload.refreshToken,
    user: payload.user.userId,
  });

  if (!existingToken) {
    throw unAuthorizedError('Authentication failed. Please try again.');
  }

  attachCookiesToResponse({
    res,
    user: payload.user,
    refreshToken: existingToken.refreshToken,
  });

  
  req.user = payload.user;
  next();
};

export default authenticateUser;
