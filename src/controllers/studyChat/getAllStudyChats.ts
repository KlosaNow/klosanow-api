import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { StudyChat } from "../../models";
import { CustomRequest, errorRes, successRes } from "../../utils";

const getAllStudyChats = async (req: CustomRequest, res: Response) => {
	try {
		const user = req.user;
		const studyChats = await StudyChat.find({
			members: { $in: [user._id] },
		})
			.sort({ updatedAt: -1 })
			.populate("members")
			.exec();

		res.status(StatusCodes.OK).json(
			successRes("Study chats returned successfully", studyChats)
		);
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default getAllStudyChats;
