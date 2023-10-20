import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Chat, Message } from "../../models";
import {
    errorRes,
    successRes,
    notFoundError,
    CustomRequest,
} from "../../utils";

const getChatById = async (req: CustomRequest, res: Response) => {
    try {
        const { id } = req.params;
        const chat = await Chat.findOne({ _id: id });
        if (!chat) throw notFoundError("Chat not found");

        const allChatMessages = await Message.find({ chatId: chat._id });

        res.status(StatusCodes.OK).json(
            successRes("Chat returned successfully", allChatMessages)
        );
    } catch (err: any) {
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
            errorRes(err.message)
        );
    }
};

export default getChatById;
