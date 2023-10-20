import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Chat, Message } from "../../models";
import {
    errorRes,
    successRes,
    CustomRequest,
    notFoundError,
} from "../../utils";

const deleteChatById = async (req: CustomRequest, res: Response) => {
    try {
        const { id } = req.params;
        const chat = await Chat.findOne({ _id: id });
        if (!chat) throw notFoundError("Chat not found");

        await Message.deleteMany({ chatId: chat._id });
        await chat.deleteOne({ chat });

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
