import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Chat } from "../../models";
import { CustomRequest, errorRes, successRes } from "../../utils";

const getAllChats = async (req: CustomRequest, res: Response) => {
	try {
		const { user } = req.user;

		const chats = await Chat.find({ members: { $in: [user._id] } })
			.sort({ updatedAt: -1 })
			.populate("members")
			.exec();

		res.status(StatusCodes.OK).json(
			successRes("Chats returned successfully", chats)
		);
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default getAllChats;
