import mongoose from "mongoose";

import { StudyChatType } from "../utils/types";
import { STUDYCHAT_MEMBERS_LIMIT } from "../utils/limits";

const studyChatMembersLimit = (membersList: Array<"User">) =>
	membersList.length <= STUDYCHAT_MEMBERS_LIMIT;

const StudyChatSchema = new mongoose.Schema<StudyChatType>(
	{
		title: {
			type: String,
			required: [true, "Please include a title for the study chat"],
		},
		photoUrl: {
			type: String,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		slug: {
			type: String,
		},
		members: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
			],
			required: true,
			validate: [
				studyChatMembersLimit,
				`StudyChat cannot contain more than ${STUDYCHAT_MEMBERS_LIMIT} members`,
			],
		},
	},
	{ timestamps: true }
);

const StudyChat = mongoose.model("StudyChat", StudyChatSchema);

export default StudyChat;
