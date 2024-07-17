import mongoose from "mongoose";

import { MessageType } from "../utils/types";

const ChatMessageSchema = new mongoose.Schema<MessageType>(
    {
        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
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

const StudyChatMessageSchema = new mongoose.Schema<MessageType>(
    {
        studyChatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "StudyChat",
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const ChatMessage = mongoose.model("ChatMessage", ChatMessageSchema);
const StudyChatMessage = mongoose.model("StudyChatMessage", StudyChatMessageSchema);

export { ChatMessage, StudyChatMessage };
