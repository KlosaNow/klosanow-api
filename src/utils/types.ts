import { Types, SchemaDefinitionProperty } from "mongoose";
import { Request } from "express";

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
    createdLessons: SchemaDefinitionProperty<[]>;
    savedLessons: SchemaDefinitionProperty<[]>;
    notifications: string[];
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
    user: {
        _id: string;
        name?: string;
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
    };
    refreshToken?: string;
}

export interface CustomRequest extends Request {
    user?: any;
    file?: any;
}

export interface LessonType {
    _id: string;
    title: string;
    about: string;
    content: string;
    videoUrl: string;
    thumbnailUrl: string;
    tag: string;
    isPrivate: boolean;
    videoSize: string;
    user: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface SubscriptionType {
    _id: string;
    subscriptionType: string;
    user: Types.ObjectId;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
}

export interface TransactionType {
    _id: string;
    ref: string;
    user: Types.ObjectId;
    method: string;
    gateway: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface NotificationType {
  user: Types.ObjectId;
  type: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
