import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Chat, ChatMessage } from "../../models";
import { CustomRequest, errorRes, successRes } from "../../utils";

async function getLastMessage(chat: any) {
	const lastChatMessage = await ChatMessage.find({
		chatId: chat._id,
	})
		.sort({ updatedAt: -1 })
		.limit(1)
		.populate("sender recipient")
		.exec();

	return lastChatMessage;
}

const getAllChats = async (req: CustomRequest, res: Response) => {
	try {
		const user = req.user;

		const chats = await Chat.find({ members: { $in: [user._id] } })
			.sort({ updatedAt: -1 })
			.populate("members")
			.exec();

		const chatsWithLastMessage: any[] = [];
		if (chats) {
			for (let chat of chats) {
				const lastChatMessage = await ChatMessage.find({
					chatId: chat._id,
				})
					.sort({ updatedAt: -1 })
					.limit(1)
					.populate("sender recipient")
					.exec();

				chatsWithLastMessage.push({
					...chat.toObject(),
					lastChatMessage,
				});
			}
		}

		res.status(StatusCodes.OK).json(
			successRes("Chats returned successfully", chatsWithLastMessage)
		);
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default getAllChats;
