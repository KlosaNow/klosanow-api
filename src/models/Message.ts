import mongoose from "mongoose";

import { Message } from "../utils/types";

const MessageSchema = new mongoose.Schema<Message>(
    {
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
