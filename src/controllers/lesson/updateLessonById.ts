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

const updateLessonById = async (req: CustomRequest, res: Response) => {
    try {
        const { id } = req.params;
        const lesson = await Lesson.findById({ _id: id });
        if (!lesson) throw notFoundError("Lesson not found");

        const {
            title,
            about,
            content,
            tag,
            isPrivate,

            // Media data
            videoUrl,
            videoSize,
            thumbnailUrl,
        } = req.body;

        // Update lesson media
        /*
        if (videoUrl) {
            const videoKey = lesson.videoUrl?.split("/").pop();
            await deleteFileFromS3(videoKey!);
        }

        if (thumbnailUrl) {
            const thumbnailKey = lesson.thumbnailUrl?.split("/").pop();
            await deleteFileFromS3(thumbnailKey!);
        }
        */

        const updatedLesson = await lesson.updateOne(
            {
                title: title || lesson.title,
                about: about || lesson.about,
                content: content || lesson.content,
                tag: tag || lesson.tag,
                isPrivate: isPrivate || lesson.isPrivate,

                // Media data
                videoUrl: videoUrl || lesson.videoUrl,
                videoSize: videoSize || lesson.videoSize,
                thumbnailUrl: thumbnailUrl || lesson.thumbnailUrl,
            },
            { $new: true, runValidators: true }
        );
        res.status(StatusCodes.OK).json(
            successRes("Lesson updated successfully", updatedLesson)
        );
    } catch (err: any) {
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
            errorRes(err.message)
        );
    }
};

export default updateLessonById;
