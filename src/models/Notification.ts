import mongoose from "mongoose";
import { NotificationTypes } from "../utils/types";

const NotificationSchema = new mongoose.Schema<NotificationTypes>(
  {
    general: {
      type: Boolean,
      default: false,
    },
    channels: {
      type: Boolean,
      default: false,
    },
    studyChats: {
      type: Boolean,
      default: false,
    },
    subscription: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", NotificationSchema);

export default Notification;
