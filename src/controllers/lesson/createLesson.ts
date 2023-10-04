import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Lesson } from "../../models";
import { uploadFileToS3 } from "../../services/awsService";
import {
    errorRes,
    successRes,
    CustomRequest,
    badRequestError,
} from "../../utils";

const createLesson = async (req: CustomRequest, res: Response) => {
    try {
        const user = req.user;
        const { title, about, content, tag, isPrivate } = req.body;
        if (!title?.trim() || !about?.trim() || !content?.trim()) {
            throw badRequestError("Please provide all required fields");
        }

        // Upload lesson media
        /*
        const { url: videoUrl, size: videoSize } = await uploadFileToS3(
            req.file
        );
        const { url: thumbnailUrl } = await uploadFileToS3(req.file);
        */

        const lesson = await Lesson.create({
            title,
            about,
            content,
            isPrivate,
            tag,
            user: user.id,
            // videoUrl,
            // thumbnailUrl,
            // videoSize,
        });

        await lesson.save();

        res.status(StatusCodes.CREATED).json(
            successRes("Lesson created successfully", lesson)
        );
    } catch (err: any) {
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
            errorRes(err.message)
        );
    }
};

export default createLesson;
