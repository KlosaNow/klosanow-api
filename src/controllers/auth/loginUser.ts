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
} from "../../utils";

const loginUser = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;
		if (!email?.trim() || !password?.trim()) {
			throw badRequestError("Please provide all required fields");
		}

		// Check if a user with the passed email AND phone number exists
		const user = await User.findOne({ email });
		if (!user) {
			throw badRequestError("User with that email does not exist");
		}

		// Verify entered password
		const isValidPassword = await bcrypt.compare(
			password,
			user.password.toString()
		);
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
