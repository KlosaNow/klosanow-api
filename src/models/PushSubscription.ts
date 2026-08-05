import mongoose from "mongoose";

import { PushSubscriptionType } from "../utils/types";

const PushSubscriptionSchema = new mongoose.Schema<PushSubscriptionType>(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		endpoint: {
			type: String,
			required: true,
			unique: true,
		},
		keys: {
			p256dh: {
				type: String,
				required: true,
			},
			auth: {
				type: String,
				required: true,
			},
		},
		userAgent: {
			type: String,
		},
	},
	{ timestamps: true }
);

const PushSubscription = mongoose.model(
	"PushSubscription",
	PushSubscriptionSchema
);

export default PushSubscription;
