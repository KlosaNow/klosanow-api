import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Chat, Message, User } from "../../../models";
import {
    errorRes,
    successRes,
    CustomRequest,
    badRequestError,
} from "../../../utils";

const sendMessage = async (req: CustomRequest, res: Response) => {
    try {
        const { user } = req;
        const { recipient, text } = req.body;
        if (!recipient?.trim() || !text?.trim()) {
            throw badRequestError("Please provide all required fields");
        }

        const recipientUserExist = await User.findOne({ _id: recipient });
        if (!recipientUserExist)
            throw badRequestError("Invalid chat recipient");

        // Get chat object or create a new chat object if one does not exists
        // Using var here because let and const are block-scoped
        var chatExists = await Chat.findOne({
            members: [user._id, recipient],
        });
        if (!chatExists) {
            chatExists = new Chat({ members: [user._id, recipient] });
            await chatExists.save();
        }
        const newMessage = new Message({
            chatId: chatExists!._id,
            text,
            recipient,
        });
        await newMessage.save();
        const allChatMessages = await Message.find({ chatId: chatExists!._id });

        res.status(StatusCodes.OK).json(
            successRes("Message sent successfully", allChatMessages)
        );
    } catch (err: any) {
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
            errorRes(err.message)
        );
    }
};

export default sendMessage;
