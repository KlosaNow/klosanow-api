import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { User } from "../../models";
import {
	errorRes,
	successRes,
	CustomRequest,
	notFoundError,
	unAuthorizedError,
} from "../../utils";

const updateUserById = async (req: CustomRequest, res: Response) => {
	try {
		const { id } = req.params;
		// Check that user id matches the currently authenticated user
		if (id != req.user._id) {
			throw unAuthorizedError(
				"User does not have the permission to update this account"
			);
		}
		const user = await User.findOne({ _id: id });
		if (!user) throw notFoundError("User not found");

		const { name, bio } = req.body;

		user.name = name?.trim() ? name : user.name;
		user.bio = bio?.trim() ? bio : user.bio;

		await user.save();

		res.status(StatusCodes.OK).json(
			successRes("User data updated successfully", user)
		);
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default updateUserById;
