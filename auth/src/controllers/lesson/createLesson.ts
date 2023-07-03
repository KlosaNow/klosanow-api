import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomRequest } from '../../utils';
import { badRequestError } from '../../utils/CustomError';
import Lesson from '../../models/Lesson';
import { successRes } from '../../helpers';

const createLesson = async (req: CustomRequest, res: Response) => {
  const { title, about, content, videoUrl, thumbnailUrl, tag, isPrivate } =
    req.body;
    const { user } = req

    if (!title || !about || !content || !videoUrl || !thumbnailUrl) {
        throw badRequestError('Please provide all required fields');
    }

    const lesson = await Lesson.create({
        title,
        about,
        content,
        videoUrl,
        thumbnailUrl,
        tag,
        isPrivate,
        user: user.userId
    })

    res
    .status(StatusCodes.CREATED)
    .json(successRes('Lesson created successfully', lesson));
};

export default createLesson;