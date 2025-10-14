import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { StudyChat } from "../../../models";
import {
	errorRes,
	successRes,
	CustomRequest,
	notFoundError,
} from "../../../utils";
import { slugGenerator } from "../../../helpers/generators";

const createStudyChatSlug = async (req: CustomRequest, res: Response) => {
	try {
		const { studyChatId } = req.body;
		const studyChat = await StudyChat.findOne({ _id: studyChatId });
		if (!studyChat) throw notFoundError("Study chat not found");

		const newSlug = await slugGenerator();
		studyChat.slug = newSlug;

		await studyChat.save();

		res.status(StatusCodes.OK).json(
			successRes("Created study chat slug successfully", studyChat)
		);
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default createStudyChatSlug;
