import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import multer from "multer";

import { SLIDES_MAX_UPLOAD_MB } from "../utils/config";
import { ACCEPTED_EXTENSIONS, detectKind } from "../slides/extract";
import { CustomRequest, errorRes } from "../utils";

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: SLIDES_MAX_UPLOAD_MB * 1024 * 1024, files: 1 },
	fileFilter: (_req, file, cb) => {
		if (detectKind(file.originalname, file.mimetype)) return cb(null, true);
		cb(
			Object.assign(
				new Error(
					`Unsupported file type. Accepted: ${ACCEPTED_EXTENSIONS.join(", ")}`
				),
				{ statusCode: StatusCodes.UNSUPPORTED_MEDIA_TYPE }
			)
		);
	},
}).single("document");

export const uploadDocument = (
	req: CustomRequest,
	res: Response,
	next: NextFunction
) => {
	upload(req, res, (err: any) => {
		if (!err) return next();

		if (err instanceof multer.MulterError) {
			const statusCode =
				err.code === "LIMIT_FILE_SIZE"
					? StatusCodes.REQUEST_TOO_LONG
					: StatusCodes.BAD_REQUEST;
			const message =
				err.code === "LIMIT_FILE_SIZE"
					? "That file is too large."
					: `Upload rejected: ${err.message}`;
			return res.status(statusCode).json(errorRes(message));
		}

		res
			.status(err.statusCode || StatusCodes.BAD_REQUEST)
			.json(errorRes(err.message));
	});
};
