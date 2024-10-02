import { Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import { errorRes, CustomRequest, badRequestError } from "../utils";
import { User } from "../models";

const STORAGE_ALLOCATION_PER_USER = 1024 * 1024 * 300; // Default max storage limit 300 MB

const getUserStorageUsage = async (userId: string): Promise<number> => {
	try {
		const user = await User.findById(userId);
		if (!user) throw badRequestError("Invalid user id");
		return user.storageUsage || 0;
	} catch (error) {
		throw new Error("Error getting user storage usage");
	}
};

const getMaxStorageLimit = async (userId: string): Promise<number> => {
	try {
		const user = await User.findById(userId);
		if (!user) throw badRequestError("Invalid user id");
		return user.maxStorageLimit || STORAGE_ALLOCATION_PER_USER;
	} catch (error) {
		throw new Error("Error getting user max storage limit");
	}
};

export const checkStorageLimit = async (
	req: CustomRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const { user } = req;

		const userStorageUsage = await getUserStorageUsage(user._id);
		const maxStorageLimit = await getMaxStorageLimit(user._id);

		const fileSize = req.file.size;

		if (userStorageUsage + fileSize > maxStorageLimit) {
			throw badRequestError("Not enough storage space");
		}
		next();
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};
