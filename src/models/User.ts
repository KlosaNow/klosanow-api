import mongoose from "mongoose";
import validator from "validator";

import { UserType } from "../utils/types";
import { STUDYCHAT_CREATION_LIMIT, USER_STORAGE_LIMIT } from "../utils/limits";

const studyChatOwnershipLimit = (ownedStudyChatList: Array<"StudyChat">) => {
	return ownedStudyChatList.length <= 1;
};

const UserSchema = new mongoose.Schema<UserType>(
	{
		name: {
			type: String,
			required: [true, "Please provide a username"],
		},
		email: {
			type: String,
			required: [true, "Please provide an email"],
			unique: true,
			validate: {
				validator: validator.isEmail,
				message: "Please provide valid email",
			},
		},
		phoneNumber: {
			type: String,
			required: [true, "Please provide a phone number"],
			unique: true,
			validate: {
				validator: validator.isMobilePhone,
				message: "Please provide valid phone number",
			},
		},
		studyChats: {
			owns: {
				type: [
					{
						type: mongoose.Schema.Types.ObjectId,
						ref: "StudyChat",
					},
				],
				validate: [
					studyChatOwnershipLimit,
					`A user can only create ${STUDYCHAT_CREATION_LIMIT} study chat`,
				],
			},
		},
		role: {
			type: String,
			enum: ["tutor", "student", "admin"],
			default: "student",
		},
		bio: {
			type: String,
		},
		createdLessons: {
			type: Array,
		},
		savedLessons: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "Lesson",
				},
			],
		},
		notifications: {
			type: [String],
		},
		storageUsage: {
			type: Number,
			default: 0, // Initial storage usage
		},
		maxStorageLimit: {
			type: Number,
			default: USER_STORAGE_LIMIT,
		},
	},
	{ timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
