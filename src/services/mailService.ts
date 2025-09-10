import { COMPANY_EMAIL, ZEPTOMAIL_API_KEY } from "../utils/config";
import { internalServerError } from "../utils";

interface EmailRecipient {
	email_address: {
		address: string;
		name: string;
	};
}

const ZEPTOMAIL_API_URL = "https://api.zeptomail.com/v1.1/email";

export const sendEmail = async (
	subject: string,
	body: string,
	recipients: EmailRecipient[]
) => {
	if (!COMPANY_EMAIL || !ZEPTOMAIL_API_KEY) {
		throw internalServerError(
			"Missing COMPANY_EMAIL or ZEPTOMAIL_API_KEY environment variable"
		);
	}

	const response = await fetch(ZEPTOMAIL_API_URL, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: ZEPTOMAIL_API_KEY,
		},
		body: JSON.stringify({
			from: { address: COMPANY_EMAIL, name: "Klosanow" },
			reply_to: [{ address: COMPANY_EMAIL, name: "Klosanow" }],
			to: recipients,
			subject: subject,
			htmlbody: body,
			track_clicks: true,
			track_opens: true,
		}),
	});

	const data = await response.json();

	if (data.error) {
		console.error(data);
		throw new Error(`Failed to send email: ${data.error.message}`);
	}
};
