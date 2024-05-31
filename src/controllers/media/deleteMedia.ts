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
        const { videoUrl, thumbnailUrl } = req.body;
        if (!videoUrl?.trim() || !thumbnailUrl?.trim()) {
            throw badRequestError("Please provide all required fields");
        }

        const videoKey = videoUrl.split("/").pop();
        const videoSize = await getFileSizeFromS3(videoKey);
        await deleteFilesFromS3([videoKey]);

        const thumbnailKey = thumbnailUrl.split("/").pop();
        const thumbnailSize = await getFileSizeFromS3(thumbnailKey);
        await deleteFilesFromS3([thumbnailKey]);

        const size = thumbnailSize + videoSize;
        // Decrement user storage usage
        const user = await User.findById(req.user._id);
        if (!user) throw badRequestError("Invalid user");
        if (user.storageUsage > size) user.storageUsage -= size;
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
