import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";

import { User } from "../../models";
import {
	errorRes,
	createJWT,
	successRes,
	badRequestError,
	generateRefreshToken,
	unAuthorizedError,
} from "../../utils";
import { tokenGenerator } from "../../helpers";
import { SERVER_URL } from "../../utils/config";
import {
	generateVerifyEmailTemplate,
	sendEmail,
} from "../../services/mailService";

const loginUser = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;
		if (!email?.trim() || !password?.trim()) {
			throw badRequestError("Please provide all required fields");
		}

		// Check if a user with the passed email AND phone number exists
		const user = await User.findOne({ email }).select("+password");
		if (!user) {
			throw badRequestError("User with that email does not exist");
		}

		// Check if user is verified, if they are not, resend the verification email and return an error
		if (!user.isVerified) {
			const token = await tokenGenerator(user._id);

			const emailBody = generateVerifyEmailTemplate(
				user.firstName,
				token
			);

			const recipient = {
				email_address: {
					address: user.email.toString(),
					name: user.firstName.toString(),
				},
			};

			await sendEmail("Verify Email Address", emailBody, [recipient]);

			throw unAuthorizedError("User email not verified");
		}

		// Verify entered password
		const isValidPassword = bcrypt.compareSync(password, user.password);
		if (!isValidPassword) throw badRequestError("Invalid password");

		// Create an access token and send it as a response
		// Create a refresh token and send it as a cookie.
		const accessToken = await createJWT({ user });
		const refreshToken = await generateRefreshToken({ user });
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
			secure: true, // Set to true if using HTTPS
		});

		res.status(StatusCodes.OK).json(
			successRes("Logged in Successfully", {
				user: { _id: user._id, email },
				token: accessToken,
			})
		);
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default loginUser;
