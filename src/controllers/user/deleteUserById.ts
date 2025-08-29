import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import {
	Chat,
	ChatMessage,
	Draft,
	Lesson,
	StudyChat,
	StudyChatMessage,
	User,
} from "../../models";
import {
	errorRes,
	successRes,
	CustomRequest,
	notFoundError,
	badRequestError,
	unAuthorizedError,
} from "../../utils";

const deleteUserById = async (req: CustomRequest, res: Response) => {
	try {
		const { id } = req.params;
		// Check that user id matches the currently authenticated user
		if (id != req.user._id) {
			throw unAuthorizedError(
				"User does not have the permission to delete this account"
			);
		}
		const user = await User.findOne({ _id: id });
		if (!user) throw notFoundError("User not found");

		// Check if user has manually deleted all their created drafts and lessons
		const drafts = await Draft.find({ user: user._id });
		const lessons = await Lesson.find({ user: user._id });

		if (drafts || lessons) {
			throw badRequestError(
				"User must delete all created drafts and lessons before deleting account"
			);
		}

		// Delete all of the user's footprint
		await Chat.deleteMany({ members: { $in: [user._id] } });
		await StudyChat.deleteMany({ owner: user._id });
		await ChatMessage.deleteMany({ sender: user._id });
		await StudyChatMessage.deleteMany({ sender: user._id });

		// Finally delete the user data
		await user.deleteOne();

		res.status(StatusCodes.OK).json(
			successRes("User deleted successfully", user)
		);
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default deleteUserById;
