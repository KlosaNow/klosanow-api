import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { StudyChat, StudyChatMessage } from "../../models";
import {
	errorRes,
	successRes,
	CustomRequest,
	notFoundError,
} from "../../utils";

const getAllStudyChatById = async (req: CustomRequest, res: Response) => {
	try {
		const { id } = req.params;
		const studyChat = await StudyChat.findOne({ _id: id });
		if (!studyChat) throw notFoundError("Study chat not found");
		const allStudyChatMessages = await StudyChatMessage.find({
			studyChatId: studyChat._id,
		}).populate("sender");
		res.status(StatusCodes.OK).json(
			successRes("Study chat returned successfully", allStudyChatMessages)
		);
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default getAllStudyChatById;
