import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { User } from "../../models";
import { tokenGenerator } from "../../helpers";
import { errorRes, successRes, badRequestError } from "../../utils";

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
