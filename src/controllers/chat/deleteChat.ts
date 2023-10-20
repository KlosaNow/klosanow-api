import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Chat } from "../../models";
import {
    errorRes,
    successRes,
    CustomRequest,
    notFoundError,
    badRequestError,
} from "../../utils";

const deleteChat = async (req: CustomRequest, res: Response) => {
    try {
        const { recipient } = req.params;
        if (!recipient) {
            throw badRequestError("Please provide all required fields");
        }
        const chat = await Chat.findOneAndDelete({ recipient: recipient });

        const chats = await Chat.find();

        if (!chat) throw notFoundError("Chats to this user do not exist");
        res.status(StatusCodes.OK).json(
            successRes("Chats deleted successfully", chats)
        );
    } catch (err: any) {
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
            errorRes(err.message)
        );
    }
};

export default deleteChat;
