import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Chat, ChatMessage } from "../../models";
import {
	CustomRequest,
	errorRes,
	notFoundError,
	successRes,
} from "../../utils";

const deleteChatById = async (req: CustomRequest, res: Response) => {
	try {
		const { id } = req.params;
		const chat = await Chat.findOne({ _id: id });
		if (!chat) throw notFoundError("Chat not found");

		await ChatMessage.deleteMany({ chatId: chat._id });
		await chat.deleteOne();

		res.status(StatusCodes.OK).json(
			successRes("Chat deleted successfully")
		);
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default deleteChatById;
