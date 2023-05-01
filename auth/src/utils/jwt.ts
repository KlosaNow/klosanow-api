import jwt from 'jsonwebtoken';
import { JWTPayload, UserType } from './types';
import { Response } from 'express';

// create the JWT Token
export const createJWT = ({ payload }: JWTPayload | { payload: UserType }) => {
  const secret = process.env.JWT_SECRET!;
  const token = jwt.sign(payload, secret);
  return token;
};

// verify the JWT Token
export const verifyJWT = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET!);

// attach the JWT Token to the response
export const attachCookiesToResponse = ({
  res,
  user,
  refreshToken,
}: {
  res: Response;
  user: UserType;
  refreshToken: string;
}) => {
  const accessJWTToken = createJWT({ payload: user });
  const refreshJWTToken = createJWT({ payload: { user, refreshToken } });

  const oneDay = 1000 * 60 * 60 * 24;
  const oneHour = 1000 * 60 * 60;

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
};
