import mongoose from "mongoose";

import { StudyChatType } from "../utils/types";

const studyChatMembersLimit = (membersList: Array<"User">) => membersList.length <= 20;

const StudyChatSchema = new mongoose.Schema<StudyChatType>(
    {
        title: {
            type: String,
            required: [true, "Please include a title for the study chat"],
        },
        photoUrl: {
            type: String,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        members: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
            ],
            required: true,
            validate: [studyChatMembersLimit, "StudyChat cannot contain more than twenty members"],
        },
    },
    { timestamps: true }
);

const StudyChat = mongoose.model("StudyChat", StudyChatSchema);

export default StudyChat;
