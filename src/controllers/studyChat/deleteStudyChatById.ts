import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { StudyChat, StudyChatMessage, User } from "../../models";
import {
	errorRes,
	successRes,
	CustomRequest,
	notFoundError,
} from "../../utils";

const deleteStudyChatById = async (req: CustomRequest, res: Response) => {
	try {
		const { id } = req.params;
		const studyChat = await StudyChat.findOne({ _id: id });
		if (!studyChat) throw notFoundError("Study chat not found");

		await StudyChatMessage.deleteMany({ studyChatId: studyChat._id });
		await studyChat.deleteOne();

		let { user } = req.user;
		user = await User.findOne({ _id: user._id });

		const studyChatIndex = user.studyChats.owns.indexOf(studyChat._id);
		user.studyChats.owns.splice(studyChatIndex, 1);
		await user.save();

		res.status(StatusCodes.OK).json(
			successRes("Study chat deleted successfully")
		);
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default deleteStudyChatById;
