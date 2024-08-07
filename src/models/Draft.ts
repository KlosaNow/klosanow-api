import mongoose from "mongoose";
import { DraftType } from "../utils/types";

const DraftSchema = new mongoose.Schema<DraftType>(
	{
		title: {
			type: String,
			required: false,
		},
		about: {
			type: String,
			required: false,
		},
		content: {
			type: [String],
		},
		videoUrl: {
			type: String,
			required: false,
		},
		videoSize: {
			type: String,
			required: false,
		},
		thumbnailUrl: {
			type: String,
			required: false,
		},
		thumbnailSize: {
			type: String,
		},
		tag: {
			type: String,
			required: false,
		},
		isPrivate: {
			type: Boolean,
			default: false,
		},
		template: {
			type: String,
			enum: ["slide", "scroll"],
			required: [true, "Please include a lesson template"],
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			// required: [true, "Please provide user id"],
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Draft", DraftSchema);
