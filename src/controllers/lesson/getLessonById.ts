import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Lesson } from "../../models";
import {
	errorRes,
	successRes,
	CustomRequest,
	notFoundError,
} from "../../utils";

const getLessonById = async (req: CustomRequest, res: Response) => {
	try {
		const { id } = req.params;
		const lesson = await Lesson.findById({ _id: id }).populate({
			path: "user",
			select: ["name", "bio"],
		});
		if (!lesson) throw notFoundError("Lesson not found");
		res.status(StatusCodes.OK).json(
			successRes("Lesson returned successfully", lesson)
		);
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default getLessonById;
