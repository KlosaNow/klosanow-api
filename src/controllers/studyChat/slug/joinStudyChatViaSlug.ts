import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { StudyChat, StudyChatMessage } from "../../../models";
import {
	errorRes,
	successRes,
	CustomRequest,
	notFoundError,
} from "../../../utils";

const joinStudyChatViaSlug = async (req: CustomRequest, res: Response) => {
	try {
		const { slug } = req.params;
		const studyChat = await StudyChat.findOne({ slug });
		if (!studyChat) throw notFoundError("Study chat not found");

		if (
			!studyChat.members.some(
				(member) => member._id.toString() == req.user._id
			)
		) {
			studyChat.members.push(req.user._id);
		}

		const allStudyChatMessages = await StudyChatMessage.find({
			studyChatId: studyChat._id,
		}).populate("sender");

		res.status(StatusCodes.OK).json(
			successRes(
				"Joined the study chat successfully",
				allStudyChatMessages
			)
		);
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default joinStudyChatViaSlug;
