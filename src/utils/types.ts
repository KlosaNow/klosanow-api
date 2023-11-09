import { Types, SchemaDefinitionProperty } from "mongoose";

export interface UserType {
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

export interface OTPType {
    otp: number;
    user: Types.ObjectId;
}

export interface TokenType {
    token: string;
    user: Types.ObjectId;
}

export interface JWTPayloadType {
    user: {};
}

export interface MessageType {
    chatId: Types.ObjectId;
    text: string;
    recipient: Types.ObjectId;
}

export interface ChatType {
    _id: Types.ObjectId;
    members: [Types.ObjectId];
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
}
