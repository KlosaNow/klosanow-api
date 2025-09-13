import { COMPANY_EMAIL, ZEPTOMAIL_API_KEY } from "../utils/config";
import { internalServerError } from "../utils";
import { FRONTEND_URL } from "../utils/config";

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

export const generateVerifyEmailTemplate = (firstName: string, token: string) =>
	`
	<!DOCTYPE html>
	<html>
		<head>
			<meta charset="UTF-8">
			<style>
				body { font-family: Arial, sans-serif; background: #f9f9f9; margin: 0; padding: 0; }
				h1 { color: rgb(129, 98, 255); }
				p { color: #333; line-height: 1.6; }
				.container { 
					background: #fff; 
					max-width: 600px; 
					margin: 40px auto; 
					padding: 32px; 
					border-radius: 8px; 
					box-shadow: 0 2px 8px rgba(0,0,0,0.05);
				}
				.button {
					display: inline-block;
					padding: 12px 24px;
					border-radius: 4px;
					background:rgb(129, 98, 255);
					color: #fff;
					text-decoration: none;
					margin-top: 24px;
					font-weight: bold;
				}
			</style>
		</head>
		<body>
			<div class="container">
				<h1>Welcome to Our Community!</h1>
				<p>Hi <strong>${firstName}</strong>,</p>
				<p>
					We're excited to have you join us! Thank you for signing up. You're now part of a growing community where you can connect, learn, and grow.
				</p>
				<p>
					To get started, please verify your email address and complete your profile.
				</p>
				<a href="${FRONTEND_URL}/auth/verify-otp/${token}"><span class="button">Verify Email</span></a>
				<p>
					If you have any questions, feel free to reply to this email. We're here to help!
				</p>
				<p>
					Best regards,<br>
					Klosanow
				</p>
			</div>
		</body>
	</html>
`;

export const generateResetPasswordTemplate = (
	firstName: string,
	token: string
) =>
	`
	<!DOCTYPE html>
	<html>
		<head>
			<meta charset="UTF-8">
			<style>
				body { font-family: Arial, sans-serif; background: #f9f9f9; margin: 0; padding: 0; }
				h1 { color: rgb(129, 98, 255); }
				p { color: #333; line-height: 1.6; }
				.container { 
					background: #fff; 
					max-width: 600px; 
					margin: 40px auto; 
					padding: 32px; 
					border-radius: 8px; 
					box-shadow: 0 2px 8px rgba(0,0,0,0.05);
				}
				.button {
					display: inline-block;
					padding: 12px 24px;
					border-radius: 4px;
					background:rgb(129, 98, 255);
					color: #fff;
					text-decoration: none;
					margin-top: 24px;
					font-weight: bold;
				}
			</style>
		</head>
		<body>
			<div class="container">
				<p>Hi <strong>${firstName}</strong>,</p>
				<p>
					Kindly reset your password to regain access to your account.
				</p>
				<a href="${FRONTEND_URL}/auth/reset-otp/${token}"><span class="button">Reset Password</span></a>
				<p>
					If you have any questions, feel free to reply to this email. We're here to help!
				</p>
				<p>
					Best regards,<br>
					Klosanow
				</p>
			</div>
		</body>
	</html>
`;
