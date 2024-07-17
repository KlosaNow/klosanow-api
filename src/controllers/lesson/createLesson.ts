import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Lesson, Draft } from "../../models";
import {
    errorRes,
    successRes,
    CustomRequest,
    badRequestError,
} from "../../utils";

const createLesson = async (req: CustomRequest, res: Response) => {
    try {
        const user = req.user;

        const {
            draft_id,
            title,
            about,
            content,
            tag,
            isPrivate,
            videoUrl,
            videoSize,
            thumbnailUrl,
            thumbnailSize,
        } = req.body;
        if (
            !title?.trim() ||
            !about?.trim() ||
            !content?.trim() ||
            !videoUrl?.trim() ||
            !videoSize ||
            !thumbnailUrl?.trim() ||
            !thumbnailSize
        ) {
            throw badRequestError("Please provide all required fields");
        }

        if (draft_id) {
            // If a draft id was provided then it should be deletedbefore creating a new Lesson
            await Draft.deleteOne({ _id: draft_id });
        }
        const lesson = new Lesson({
            tag,
            about,
            title,
            content,
            videoUrl,
            isPrivate,
            videoSize,
            thumbnailUrl,
            thumbnailSize,
            user: user._id,
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
