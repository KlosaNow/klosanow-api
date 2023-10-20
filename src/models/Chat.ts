import mongoose from "mongoose";

import { ChatType, Message } from "../utils/types";

const ChatSchema = new mongoose.Schema<ChatType>(
    {
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
        messages: [],
    },
    { timestamps: true }
);

const Chat = mongoose.model("Chat", ChatSchema);

export default Chat;
