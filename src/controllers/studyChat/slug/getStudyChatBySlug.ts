import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { StudyChat } from "../../../models";
import {
	errorRes,
	successRes,
	CustomRequest,
	notFoundError,
} from "../../../utils";

const getStudyChatBySlug = async (req: CustomRequest, res: Response) => {
	try {
		const { slug } = req.params;
		const studyChat = await StudyChat.findOne({ slug }).populate("members");
		if (!studyChat) throw notFoundError("Study chat not found");

		res.status(StatusCodes.OK).json(
			successRes("Study chat returned successfully", studyChat)
		);
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default getStudyChatBySlug;
