import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Lesson } from "../../models";
import {
    errorRes,
    successRes,
    CustomRequest,
    notFoundError,
} from "../../utils";

import { deleteFileFromS3 } from "../../services/awsService";

const deleteLessonById = async (req: CustomRequest, res: Response) => {
    try {
        const { id } = req.params;
        const lesson = await Lesson.findById({ _id: id });
        if (!lesson) throw notFoundError("Lesson not found");

        // Delete lesson media
        /*
        const videoKey = lesson.videoUrl?.split("/").pop();
        const thumbnailKey = lesson.thumbnailUrl?.split("/").pop();
        await deleteFileFromS3(videoKey!);

        if (lesson.thumbnailUrl) {
            await deleteFileFromS3(thumbnailKey!);
        }
        */

        await lesson.deleteOne();

        res.status(StatusCodes.OK).json(
            successRes("Lesson deleted successfully")
        );
    } catch (err: any) {
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
            errorRes(err.message)
        );
    }
};

export default deleteLessonById;
