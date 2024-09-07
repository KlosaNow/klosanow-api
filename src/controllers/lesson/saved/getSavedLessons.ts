import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { User } from "../../../models";
import {
	errorRes,
	successRes,
	CustomRequest,
	notFoundError,
	badRequestError,
} from "../../../utils";

const getSavedLessons = async (req: CustomRequest, res: Response) => {
	try {
		const user = await User.findOne({ _id: req.user._id });
		if (!user) throw notFoundError("User not found");

		res.status(StatusCodes.CREATED).json(
			successRes("Saved lessons returned successfully", user.savedLessons)
		);
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default getSavedLessons;
