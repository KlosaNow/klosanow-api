import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Lesson } from "../../models";
import {
  errorRes,
  successRes,
  CustomRequest,
  badRequestError,
} from "../../utils";

const createLesson = async (req: CustomRequest, res: Response) => {
  try {
    const user = req.user;

    const { title, about, content, tag, isPrivate, videoUrl, videoSize } =
      req.body;
    if (
      !title?.trim() ||
      !about?.trim() ||
      !content?.trim() ||
      !videoUrl?.trim() ||
      !videoSize
    ) {
      throw badRequestError("Please provide all required fields");
    }

    const lesson = new Lesson({
      tag,
      about,
      title,
      content,
      videoUrl,
      isPrivate,
      videoSize,
      user: user._id,
      // thumbnailUrl,
    });
    await lesson.save();

    res
      .status(StatusCodes.CREATED)
      .json(successRes("Lesson created successfully", lesson));
  } catch (err: any) {
    res
      .status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorRes(err.message));
  }
};

export default createLesson;
