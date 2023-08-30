import { CustomRequest } from "../../utils";
import { Lesson } from "../../models";
import { notFoundError } from "../../utils/CustomError";
import { deleteFileFromS3 } from "../../services/awsService";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { successRes } from "../../helpers";

const updateLesson = async (req: CustomRequest, res: Response) => {
    const { lessonId } = req.query;
    const {
        title,
        about,
        content,
        videoUrl,
        thumbnailUrl,
        tag,
        isPrivate,
        videoSize,
    } = req.body;

    const lesson = await Lesson.findById({ _id: lessonId });
    if (!lesson) {
        throw notFoundError("Lesson does not exist");
    }

    if (videoUrl) {
        const videoKey = lesson.videoUrl?.split("/").pop();
        await deleteFileFromS3(videoKey!);
    }

    if (thumbnailUrl) {
        const thumbnailKey = lesson.thumbnailUrl?.split("/").pop();
        await deleteFileFromS3(thumbnailKey!);
    }

    const updatedLesson = await lesson.updateOne(
        {
            title: title || lesson.title,
            about: about || lesson.about,
            content: content || lesson.content,
            videoUrl: videoUrl || lesson.videoUrl,
            thumbnailUrl: thumbnailUrl || lesson.thumbnailUrl,
            tag: tag || lesson.tag,
            isPrivate: isPrivate || lesson.isPrivate,
            videoSize: videoSize || lesson.videoSize,
        },
        { $new: true, runValidators: true }
    );
    res.status(StatusCodes.OK).json(
        successRes("Lesson updated successfully", updatedLesson)
    );
};

export default updateLesson;
