import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { uploadFileToS3 } from "../../services/awsService";
import { CustomRequest } from "../../utils";
import { badRequestError } from "../../utils/CustomError";
import { Lesson } from "../../models";
import { successRes } from "../../helpers";

const createLesson = async (req: CustomRequest, res: Response) => {
    const { title, about, content, tag, isPrivate } = req.body;
    const { user } = req.user;

    if (!title || !about || !content) {
        throw badRequestError("Please provide all required fields");
    }
    const { url: videoUrl, size: videoSize } = await uploadFileToS3(req.file);
    const { url: thumbnailUrl } = await uploadFileToS3(req.file);

    const lesson = await Lesson.create({
        title,
        about,
        content,
        videoUrl,
        // thumbnailUrl,
        tag,
        isPrivate,
        videoSize,
        user: user._id,
    });

    await lesson.save();

    res.status(StatusCodes.CREATED).json(
        successRes("Lesson created successfully", lesson)
    );
};

export default createLesson;
