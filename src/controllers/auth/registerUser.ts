import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";

import { tokenGenerator, transformPhone } from "../../helpers";
import { User } from "../../models";
import { badRequestError, errorRes, successRes } from "../../utils";
import { SERVER_URL } from "../../utils/config";
import {
	generateVerifyEmailTemplate,
	sendEmail,
} from "../../services/mailService";

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

		const emailBody = generateVerifyEmailTemplate(newUser.firstName, token);

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
