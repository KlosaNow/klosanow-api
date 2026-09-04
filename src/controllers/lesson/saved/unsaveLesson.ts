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

const unsaveLesson = async (req: CustomRequest, res: Response) => {
	try {
		const { lessonId } = req.body;
		if (!lessonId?.trim()) {
			throw badRequestError("Please provide a lesson id");
		}

		const user = await User.findOne({ _id: req.user._id });
		if (!user) throw notFoundError("User not found");
		if (user.savedLessons.includes(lessonId)) {
			user.savedLessons.splice(user.savedLessons.indexOf(lessonId), 1);
			await user.save();
		}

		res.status(StatusCodes.OK).json(
			successRes("Lesson unsaved successfully")
		);
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default unsaveLesson;
