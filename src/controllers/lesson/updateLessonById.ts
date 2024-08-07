import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Lesson } from "../../models";
import {
	errorRes,
	successRes,
	CustomRequest,
	notFoundError,
} from "../../utils";

const updateLessonById = async (req: CustomRequest, res: Response) => {
	try {
		const { id } = req.params;
		const lesson = await Lesson.findById({ _id: id });
		if (!lesson) throw notFoundError("Lesson not found");

		const {
			tag,
			about,
			title,
			content,
			videoUrl,
			isPrivate,
			videoSize,
			thumbnailUrl,
			thumbnailSize,
		} = req.body;

		// Update lesson fields
		lesson.tag = tag ? tag : lesson.tag;
		lesson.about = about?.trim() ? about : lesson.about;
		lesson.title = title?.trim() ? title : lesson.title;
		lesson.isPrivate = isPrivate ? isPrivate : lesson.isPrivate;
		lesson.videoUrl = videoUrl?.trim() ? videoUrl : lesson.videoUrl;
		lesson.videoSize = videoSize?.trim() ? videoSize : lesson.videoSize;
		lesson.thumbnailUrl = thumbnailUrl?.trim()
			? thumbnailUrl
			: lesson.thumbnailUrl;
		lesson.thumbnailSize = thumbnailSize?.trim()
			? thumbnailSize
			: lesson.thumbnailSize;
		if (content?.length > 0) {
			content.forEach((element: any) => lesson.content.push(element));
		}
		await lesson.save();

		res.status(StatusCodes.OK).json(
			successRes("Lesson updated successfully", lesson)
		);
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default updateLessonById;
