import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { User } from "../../models";
import { tokenGenerator } from "../../helpers";
import { errorRes, successRes, badRequestError } from "../../utils";
import { SERVER_URL } from "../..//utils/config";
import { sendEmail } from "../../services/mailService";

const forgotPassword = async (req: Request, res: Response) => {
	try {
		const { email } = req.body;
		if (!email?.trim()) {
			throw badRequestError("Please provide a valid email address");
		}

		// Check if a user with the passed email exists
		const user = await User.findOne({ email });
		if (!user) {
			throw badRequestError("User with that email does not exist");
		}

		const token = await tokenGenerator(user._id);

		const emailBody = `
				<!DOCTYPE html>
				<html>
				<head>
				  <meta charset="UTF-8">
				  <style>
					body { font-family: Arial, sans-serif; background: #f9f9f9; margin: 0; padding: 0; }
					.container { background: #fff; max-width: 600px; margin: 40px auto; padding: 32px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);}
					h1 { color: rgb(129, 98, 255); }
					p { color: #333; line-height: 1.6; }
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
					<p>Hi <strong>${user.firstName}</strong>,</p>
					<p>
					  Kindly reset your password to regain access to your account.
					</p>
					<a href="${SERVER_URL}/api/v1/auth/reset-passsword/${token}"><span class="button">Reset Password</span></a>
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

		const recipient = {
			email_address: {
				address: user.email.toString(),
				name: user.firstName?.toString(),
			},
		};

		await sendEmail("Reset Password", emailBody, [recipient]);

		res.status(StatusCodes.OK).json(
			successRes("Password reset link sent successfully", { token })
		);
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default forgotPassword;
