import webpush from "web-push";

import {
	VAPID_PUBLIC_KEY,
	VAPID_PRIVATE_KEY,
	VAPID_SUBJECT,
} from "../utils/config";
import { PushSubscription } from "../models";

if (VAPID_SUBJECT && VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
	webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

interface PushPayload {
	title: string;
	body: string;
	data?: Record<string, any>;
}

export const sendPushToUser = async (userId: string, payload: PushPayload) => {
	const subscriptions = await PushSubscription.find({ user: userId });

	await Promise.all(
		subscriptions.map(async (subscription: any) => {
			try {
				await webpush.sendNotification(
					{
						endpoint: subscription.endpoint,
						keys: subscription.keys,
					},
					JSON.stringify(payload)
				);
			} catch (err: any) {
				if (err.statusCode === 404 || err.statusCode === 410) {
					await subscription.deleteOne();
				} else {
					console.error("Failed to send push notification:", err.message);
				}
			}
		})
	);
};
