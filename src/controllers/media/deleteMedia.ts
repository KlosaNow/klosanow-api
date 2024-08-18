import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { User } from "../../models";
import { deleteFilesFromS3, getFileSizeFromS3 } from "../../services";
import {
	errorRes,
	successRes,
	CustomRequest,
	badRequestError,
} from "../../utils";

const deleteMedia = async (req: CustomRequest, res: Response) => {
	try {
		const user = await User.findById(req.user._id);
		if (!user) throw badRequestError("Invalid user");

		const fileURL: any = req.query.fileURL;
		if (!fileURL?.trim()) {
			throw badRequestError("Please provide a fileURL");
		}

		const fileKey = fileURL.split("/").pop();
		const fileSize = await getFileSizeFromS3(fileKey);
		await deleteFilesFromS3([fileKey]);

		// Decrement user storage usage
		if (user.storageUsage > fileSize) user.storageUsage -= fileSize;
		else user.storageUsage = 0;
		await user.save();

		res.status(StatusCodes.OK).json(
			successRes("Media deleted successfully")
		);
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default deleteMedia;
