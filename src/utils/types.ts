import { Types, SchemaDefinitionProperty } from "mongoose";

export interface UserType {
	_id: string;
	firstName: string;
	lastName: string;
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
	password: string;
	studyChats: {
		owns: [Types.ObjectId];
	};
	isVerified: boolean;
	role: string;
	bio: string;
	photoURL: string;
	createdLessons: SchemaDefinitionProperty<[]>;
	savedLessons: [Types.ObjectId];
	notifications: [string];
	storageUsage: number;
	maxStorageLimit: number;
	createdAt: Date;
	updatedAt: Date;
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
	sender: Types.ObjectId;
	studyChatId: Types.ObjectId;
}

export interface ChatType {
	_id: Types.ObjectId;
	members: [Types.ObjectId];
}
export interface LessonType {
	_id: string;
	title: string;
	about: string;
	content: [string];
	videoUrl: string;
	thumbnailUrl: string;
	thumbnailSize: string;
	tag: string;
	isPrivate: boolean;
	videoSize: string;
	user: Types.ObjectId;
}

export interface DraftType {
	_id: string;
	title?: string;
	about?: string;
	content: [string];
	videoUrl?: string;
	thumbnailUrl?: string;
	thumbnailSize?: string;
	tag?: string;
	isPrivate?: boolean;
	videoSize?: string;
	user?: Types.ObjectId;
	template: string;
}

export interface StudyChatType {
	_id: Types.ObjectId;
	title: String;
	photoUrl: String;
	slug: String;
	owner: Types.ObjectId;
	members: [Types.ObjectId];
}

export interface PushSubscriptionType {
	_id: Types.ObjectId;
	user: Types.ObjectId;
	endpoint: string;
	keys: {
		p256dh: string;
		auth: string;
	};
	userAgent?: string;
}
