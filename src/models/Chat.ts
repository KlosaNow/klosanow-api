import mongoose from "mongoose";

import { ChatType } from "../utils/types";

const chatMembersLimit = (membersList: Array<"User">) => membersList.length == 2

const ChatSchema = new mongoose.Schema<ChatType>(
    {
        members: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
            ],
            required: true,
            validate: [chatMembersLimit, "Chat requires two users"],
        },
    },
    { timestamps: true }
);

const Chat = mongoose.model("Chat", ChatSchema);

export default Chat;
