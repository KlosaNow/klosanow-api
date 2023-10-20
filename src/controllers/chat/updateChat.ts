import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Chat, User } from "../../models";
import {
    errorRes,
    successRes,
    CustomRequest,
    notFoundError,
    badRequestError,
} from "../../utils";
import { Message } from "../../utils/types";
import mongoose from "mongoose";

const updateChat = async (req: CustomRequest, res: Response) => {
    try {
        const { user } = req;
        const { recipient } = req.params;
        const { text } = req.body;

        if (!recipient || !user || !text) {
            throw badRequestError("Please provide all required fields");
        }

        const sender = user._id;
        const newMessage: Message = {
            _id: new mongoose.Types.ObjectId(),
            text,
            timestamp: new Date(),
        };

        const chat = await Chat.findOne({ recipient });

        if (!chat) {
            throw notFoundError("Chat not found");
        }

        const message = await chat.messages;
        message.push(newMessage);
        const updatedChat = await chat.save(); // Save the chat document

        res.status(StatusCodes.OK).json(
            successRes("Message added to the chat", updatedChat)
        );
    } catch (err: any) {
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
            errorRes(err.message)
        );
    }
};

export default updateChat;
