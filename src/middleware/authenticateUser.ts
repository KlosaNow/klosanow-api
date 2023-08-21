import { Request, Response, NextFunction } from 'express';
import { verifyJWT, CustomRequest } from '../utils';
import Token from '../models/Token';
import { unAuthorizedError } from '../utils/CustomError';
import { attachCookiesToResponse } from '../utils/jwt';

export const authenticateUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  // const { accessToken, refreshToken } = req.signedCookies;
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    throw unAuthorizedError('Authentication failed. Please try again.');
  }

  if (token) {
    const payload = verifyJWT(token);
    req.user = payload.user;    
    return next();
  }
  const payload = verifyJWT(token);
  req.user = payload.user;

  const existingToken = await Token.findOne({
    refreshToken: payload.refreshToken,
    user: payload.user.userId,
  });


  res.json(attachCookiesToResponse({
    res,
    user: payload.user,
    refreshToken: existingToken?.refreshToken,
  }));

  req.user = payload.user;
  next();
};

export const authenticateUser2 = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decodedToken = verifyJWT(token); // Adjust the payload structure based on your token content
    req.user = decodedToken;
    next();
  } catch (err) {
    console.log(token);
    
    return res.status(401).json({ message: 'Invalid token' });
  }
}
