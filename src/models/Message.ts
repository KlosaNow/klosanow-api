import mongoose from "mongoose";

import { MessageType } from "../utils/types";

const MessageSchema = new mongoose.Schema<MessageType>(
    {
        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
            required: true
        },
        text: {
            type: String,
            required: true,
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);
const Message = mongoose.model("Message", MessageSchema);

export default Message;
