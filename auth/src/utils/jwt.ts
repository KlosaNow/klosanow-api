import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWTPayload, UserTypes } from './types';
import { Response } from 'express';
import { createTokenUser } from '../helpers/generators';

// create the JWT Token
export const createJWT = (payload: JWTPayload) => {
  const secret = process.env.JWT_SECRET!;
  const token = jwt.sign(payload, secret);
  return token;
};

// verify the JWT Token
export const verifyJWT = (token: string): any =>
  jwt.verify(token, process.env.JWT_SECRET!);

// attach the JWT Token to the response
export const attachCookiesToResponse = ({
  res,
  user,
  refreshToken,
}: {
  res: Response;
  user: UserTypes;
  refreshToken?: string;
}) => {
  // const userObj = createTokenUser(user)
  const accessJWTToken = createJWT({ user });
  const oneDay = 1000 * 60 * 60 * 24;
  const oneHour = 1000 * 60 * 60;

  if (!refreshToken) {
    res.cookie('accessToken', accessJWTToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      signed: true,
      maxAge: oneHour,
    });
  } else {
    const refreshJWTToken = createJWT({ user, refreshToken });
    res.cookie('accessToken', accessJWTToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      signed: true,
      maxAge: oneHour,
    });

    res.cookie('refreshToken', refreshJWTToken, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
      secure: process.env.NODE_ENV === 'production',
      signed: true,
    });
  }
};
