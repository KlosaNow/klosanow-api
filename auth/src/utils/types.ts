import { Types } from 'mongoose';

export interface UserTypes {
  username: string;
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
  isValid: boolean;
  user: Types.ObjectId;
}

export interface UserType {
  _id: Types.ObjectId;
  email: string;
  phoneNumber: string;
  role: string;
}

export interface JWTPayload {
  payload: {
    user: UserType;
    refreshToken?: string;
  };
}
