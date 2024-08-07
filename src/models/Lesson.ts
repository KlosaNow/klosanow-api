import mongoose from "mongoose";
import { LessonType } from "../utils/types";

const LessonSchema = new mongoose.Schema<LessonType>(
	{
		title: {
			type: String,
			required: [true, "Please provide a lesson title"],
		},
		about: {
			type: String,
			required: [true, "Please provide a lesson about"],
		},
		content: {
			type: [String],
			required: [true, "Please include a lesson content"],
		},
		videoUrl: {
			type: String,
			required: [true, "Please include a video url"],
		},
		thumbnailUrl: {
			type: String,
			required: [true, "Please include a thumbnail url"],
		},
		videoSize: {
			type: String,
		},
		thumbnailSize: {
			type: String,
		},
		tag: {
			type: String,
		},
		isPrivate: {
			type: Boolean,
			default: false,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Please provide user id"],
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Lesson", LessonSchema);
