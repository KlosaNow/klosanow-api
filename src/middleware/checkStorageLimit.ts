import { Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import { errorRes, CustomRequest, badRequestError } from "../utils";
import { User } from "../models";

const getUserStorageUsage = async (userId: string): Promise<number> => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        return user.storageUsage || 0;
    } catch (error) {
        throw new Error("Error getting user storage usage");
    }
};

const getMaxStorageLimit = async (userId: string): Promise<number> => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        return user.maxStorageLimit || 1024 * 1024 * 500; // Default max storage limit 500 MB
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
        const user = req.user;

        const userStorageUsage = await getUserStorageUsage(user._id);

        const maxStorageLimit = await getMaxStorageLimit(user._id);

        const fileSize = req.body.videoSize;

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
