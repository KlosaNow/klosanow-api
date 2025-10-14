import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { ChatBotMessage } from "../../models";
import { successRes, errorRes, CustomRequest } from "../../utils";

const getAllChatBotMessages = async (req: CustomRequest, res: Response) => {
	try {
		const allChatBotMessages = await ChatBotMessage.find({
			sender: req.user._id,
		});
		res.status(StatusCodes.OK).json(
			successRes(
				"Chat bot messages returned successfully",
				allChatBotMessages
			)
		);
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default getAllChatBotMessages;
