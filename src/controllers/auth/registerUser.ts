import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";

import { tokenGenerator, transformPhone } from "../../helpers";
import { User } from "../../models";
import { badRequestError, errorRes, successRes } from "../../utils";
import { SERVER_URL } from "../../utils/config";
import { sendEmail } from "../../services/mailService";

const registerUser = async (req: Request, res: Response) => {
	try {
		const {
			firstName,
			lastName,
			username,
			email,
			phoneNumber,
			password,
			confirmPassword,
			role,
		} = req.body;
		if (
			!firstName?.trim() ||
			!lastName?.trim() ||
			!username?.trim() ||
			!email?.trim() ||
			!phoneNumber?.trim() ||
			!password?.trim() ||
			!confirmPassword?.trim()
		) {
			throw badRequestError("Please provide all required fields");
		}
		const phone = transformPhone(phoneNumber);

		// Check if password and confirm password fields are the same
		if (password !== confirmPassword) {
			throw badRequestError("Passwords don't match");
		}

		// Check if a user with the passed email OR phone number exists
		const alreadyExists = await User.findOne({
			$or: [{ email }, { phoneNumber: phone }],
		});
		if (alreadyExists) {
			throw badRequestError(
				"User with that email or phone number already exists"
			);
		}

		// Hash and salt the password
		const salt = bcrypt.genSaltSync(10);
		const hashedPassword = bcrypt.hashSync(password, salt);

		const newUser = new User({
			firstName,
			lastName,
			username,
			email,
			phoneNumber: phone,
			password: hashedPassword,
			role,
		});
		await newUser.save();

		const token = await tokenGenerator(newUser._id);

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
			<h1>Welcome to Our Community!</h1>
			<p>Hi <strong>${newUser.firstName}</strong>,</p>
			<p>
			  We're excited to have you join us! Thank you for signing up. You're now part of a growing community where you can connect, learn, and grow.
			</p>
			<p>
			  To get started, please verify your email address and complete your profile.
			</p>
			<a href="${SERVER_URL}/api/v1/auth/verify-email/${token}"><span class="button">Verify Email</span></a>
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
				address: newUser.email.toString(),
				name: newUser.firstName.toString(),
			},
		};

		await sendEmail("Verify Email Address", emailBody, [recipient]);

		res.status(StatusCodes.CREATED).json(
			successRes("User created successfully. Verify email.", { token })
		);
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default registerUser;
