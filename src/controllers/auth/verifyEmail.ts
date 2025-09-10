import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Token, User } from "../../models";
import { errorRes, successRes, unAuthorizedError } from "../../utils";

const verifyEmail = async (req: Request, res: Response) => {
	try {
		const { token } = req.params;

		const tokenExists = await Token.findOne({ token });
		const user = await User.findOne({ _id: tokenExists?.user });

		if (!tokenExists || !user) {
			throw unAuthorizedError(
				"Authentication failed. Invalid or expired reset token"
			);
		}

		// Verify the user
		user.isVerified = true;
		await user.save();

		// Delete every token associated with the user
		await Token.deleteMany({ user: user._id });

		res.status(StatusCodes.OK).json(
			successRes("Email verified successfully. Log in.")
		);
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default verifyEmail;
