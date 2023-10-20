import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Chat, Message } from "../../models";
import {
    errorRes,
    successRes,
    CustomRequest,
    notFoundError,
    badRequestError,
} from "../../utils";
import mongoose from "mongoose";

const deleteMessage = async (req: CustomRequest, res: Response) => {
    try {
        const { user } = req;
        const { recipient } = req.params;
        const { text_id } = req.body;

        if (!recipient || !user || !text_id) {
            throw badRequestError("Please provide all required fields");
        }

        const chat = await Chat.findOne({ recipient: recipient });

        if (!chat) {
            throw notFoundError("Chat not found");
        }

        const message = await Message.findOneAndDelete({ _id: text_id });
        if (!message) {
            throw notFoundError("Message not found");
        }
        const messages = await Message.find({ recipient });

        chat.messages = messages;
        const updatedChat = await chat.save(); // Save the chat document

        res.status(StatusCodes.OK).json(
            successRes("Message deleted successfully", updatedChat)
        );
    } catch (err: any) {
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
            errorRes(err.message)
        );
    }
};

export default deleteMessage;
