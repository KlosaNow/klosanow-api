import mongoose from "mongoose";

import { SubscriptionType } from "../utils/types";

const SubscriptionSchema = new mongoose.Schema<SubscriptionType>(
    {
        subscriptionType: {
            type: String,
            enum: ["free", "basic", "premium"],
            required: [
                true,
                "please specify the type of subscription you want",
            ],
            default: "free",
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Subscription = mongoose.model("Subscription", SubscriptionSchema);

export default Subscription;
