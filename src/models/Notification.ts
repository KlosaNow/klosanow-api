import mongoose from "mongoose";
import { NotificationType } from "../utils/types";

const NotificationSchema = new mongoose.Schema<NotificationType>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["general", "channels", "studyChats", "subscription"],
            required: [true, "please specify the type of notification"],
        },
        content: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Notification = mongoose.model("Notification", NotificationSchema);

export default Notification;
