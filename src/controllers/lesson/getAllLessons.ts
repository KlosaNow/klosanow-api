import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Lesson } from "../../models";
import { CustomRequest, successRes, errorRes } from "../../utils";

const getAllLessons = async (req: CustomRequest, res: Response) => {
	try {
		const { user } = req;
		const lessons = await Lesson.find({ user: user._id });
		res.status(StatusCodes.OK).json(
			successRes("Lessons returned successfully", lessons)
		);
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default getAllLessons;
