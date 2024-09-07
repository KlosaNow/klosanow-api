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

const saveLesson = async (req: CustomRequest, res: Response) => {
	try {
		const { lessonId } = req.body;
		if (!lessonId?.trim()) {
			throw badRequestError("Please provide a lesson id");
		}

		const user = await User.findOne({ _id: req.user._id });
		if (!user) throw notFoundError("User not found");
		if (user.savedLessons.includes(lessonId)) {
			return res
				.status(StatusCodes.OK)
				.json(successRes("Lesson is already saved"));
		}
		user.savedLessons.push(lessonId);
		await user.save();

		res.status(StatusCodes.CREATED).json(
			successRes("Lesson saved successfully")
		);
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default saveLesson;
