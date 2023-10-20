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

const createChat = async (req: CustomRequest, res: Response) => {
    try {
        const { user } = req;
        const { recipient } = req.params;
        const { text } = req.body;

        if (!recipient || !user || !text) {
            throw badRequestError("Please provide all required fields");
        }

        const sender = user._id;
        const message: Message = {
            _id: new mongoose.Types.ObjectId(),
            text,
            timestamp: new Date(),
        };

        const chat = await Chat.findOne({ recipient: recipient });

        if (chat) throw badRequestError("Chat with this user already exists");
        const newChat = new Chat({
            sender,
            recipient,
            messages: message,
        });

        const createdChat = await newChat.save();
        res.status(StatusCodes.OK).json(
            successRes("Chat created successfully", createdChat)
        );
    } catch (err: any) {
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
            errorRes(err.message)
        );
    }
};

export default createChat;
