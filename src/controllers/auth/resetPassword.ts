import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";

import { Token, User } from "../../models";
import {
	errorRes,
	successRes,
	badRequestError,
	unAuthorizedError,
} from "../../utils";

const resetPassword = async (req: Request, res: Response) => {
	try {
		const { password, confirmPassword } = req.body;

		if (!password?.trim() || !confirmPassword?.trim()) {
			throw badRequestError("Please provide all required fields");
		}
		if (password !== confirmPassword) {
			throw badRequestError("Passwords don't match");
		}

		const { token } = req.params;

		const tokenExists = await Token.findOne({ token });
		const user = await User.findOne({ _id: tokenExists?.user }).select(
			"+password"
		);

		if (!tokenExists || !user) {
			throw unAuthorizedError(
				"Authentication failed. Invalid or expired reset token"
			);
		}

		// Hash and salt the new password
		const salt = bcrypt.genSaltSync(10);
		const hashedPassword = bcrypt.hashSync(password, salt);

		// Update the user's password
		user.password = hashedPassword;
		await user.save();

		// Delete every token associated with the user
		await Token.deleteMany({ user: user._id });

		res.status(StatusCodes.OK).json(
			successRes("Password reset successfully")
		);
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default resetPassword;
