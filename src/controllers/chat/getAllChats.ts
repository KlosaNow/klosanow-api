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

const getAllChats = async (req: CustomRequest, res: Response) => {
    try {
        const { user } = req;
        if (!user) {
            throw badRequestError("Please provide all required fields");
        }
        const chats = await Chat.find({ sender: user })
            .sort({ updatedAt: -1 })
            .exec();

        if (chats.length === 0)
            throw notFoundError("Chats for this user do not exist");
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
