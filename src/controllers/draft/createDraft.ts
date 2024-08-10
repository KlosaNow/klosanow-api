import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Draft } from "../../models";
import {
	errorRes,
	successRes,
	CustomRequest,
	badRequestError,
} from "../../utils";

const createDraft = async (req: CustomRequest, res: Response) => {
	try {
		const user = req.user;

		const {
			tag,
			title,
			about,
			content,
			template,
			isPrivate,
			videoUrl,
			videoSize,
			thumbnailUrl,
			thumbnailSize,
		} = req.body;

		if (!template?.trim()) {
			throw badRequestError("Please provide all required fields");
		}

		const draft = new Draft({
			tag,
			about,
			title,
			content,
			template,
			videoUrl,
			isPrivate,
			videoSize,
			thumbnailUrl,
			thumbnailSize,
			user: user._id,
		});
		await draft.save();

		res.status(StatusCodes.CREATED).json(
			successRes("Draft created successfully", draft)
		);
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default createDraft;
