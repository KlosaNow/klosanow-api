import { Types } from 'mongoose';
import { Request } from 'express';

export interface UserTypes {
  _id: string;
  name: string;
  email: {
    validate: {
      validator: (arg0: string) => boolean;
      message: string;
    };
  };
  phoneNumber: {
    validate: {
      validator: (arg0: string) => boolean;
      message: string;
    };
  };
  role: string;
  verificationToken: string;
  isVerified: boolean;
  verified: Date;
  passwordToken: string;
  passwordTokenExpiration: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TokenType {
  refreshToken: string;
  userAgent: string;
  ip: string;
  otpVerified: boolean;
  user: Types.ObjectId;
}

export interface OTPType {
  otp: number;
  user: Types.ObjectId;
}

export interface UserType {
  _id: string;
  email: string;
  phoneNumber: string;
  role: string;
}

export interface JWTPayload {
    user: UserTypes;
    refreshToken?: string;
}

export interface CustomRequest extends Request {
    user?: any;
}
