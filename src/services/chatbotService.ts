import { internalServerError } from "../utils";
import { CHATBOT_URL } from "../utils/config";

export const sendChatBotMessage = async (message: string) => {
	if (!CHATBOT_URL) {
		throw internalServerError("Missing CHATBOT_URL environment variable");
	}

	const response = await fetch(CHATBOT_URL, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: message,
	});

	const data = await response.json();

	return data;
};
