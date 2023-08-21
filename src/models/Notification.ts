import mongoose from "mongoose";
import { NotificationTypes, NotificationType } from "../utils/types";

const NotificationSchema = new mongoose.Schema<NotificationTypes>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", NotificationSchema);

export default Notification;
