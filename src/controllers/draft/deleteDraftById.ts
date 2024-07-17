import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Draft, User } from "../../models";
import {
    errorRes,
    successRes,
    CustomRequest,
    notFoundError,
    badRequestError,
} from "../../utils";

import { deleteFilesFromS3, getFileSizeFromS3 } from "../../services";

const deleteDraftById = async (req: CustomRequest, res: Response) => {
    try {
        const { id } = req.params;

        const draft = await Draft.findById({ _id: id });
        if (!draft) throw notFoundError("Draft not found");

        if (draft.videoUrl) {
            const videoKey = draft.videoUrl.split("/").pop();
            try {
                const videoSize = await getFileSizeFromS3(videoKey!);
                // Decrement user storage usage
                const user = await User.findById(req.user._id);
                if (!user) throw badRequestError("Invalid user");
                if (user.storageUsage > videoSize)
                    user.storageUsage -= videoSize;
                else user.storageUsage = 0;
                await user.save();
            } catch (err) {
            } finally {
                await deleteFilesFromS3([videoKey!]);
            }
        }

        if (draft.thumbnailUrl) {
            const thumbnailKey = draft.thumbnailUrl.split("/").pop();

            try {
                const thumbnailSize = await getFileSizeFromS3(thumbnailKey!);
                // Decrement user storage usage
                const user = await User.findById(req.user._id);
                if (!user) throw badRequestError("Invalid user");
                if (user.storageUsage > thumbnailSize)
                    user.storageUsage -= thumbnailSize;
                else user.storageUsage = 0;
                await user.save();
            } catch (err) {
            } finally {
                await deleteFilesFromS3([thumbnailKey!]);
            }
        }

        await draft.deleteOne();

        res.status(StatusCodes.OK).json(
            successRes("Draft deleted successfully")
        );
    } catch (err: any) {
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
            errorRes(err.message)
        );
    }
};

export default deleteDraftById;
