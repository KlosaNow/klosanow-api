import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Lesson, User } from "../../models";
import {
  errorRes,
  successRes,
  CustomRequest,
  notFoundError,
  badRequestError,
} from "../../utils";

import { deleteFilesFromS3, getFileSizeFromS3 } from "../../services";

const deleteLessonById = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findById({ _id: id });
    if (!lesson) throw notFoundError("Lesson not found");

    // Delete lesson media if any
    const videoKey = lesson.videoUrl.split("/").pop();
    // try block so that the lesson deletion process
    // does not terminate if there is no media
    try {
      const videoSize = await getFileSizeFromS3(videoKey!);
      // Decrement user storage usage
      const user = await User.findById(req.user._id);
      if (!user) throw badRequestError("Invalid user");
      if (user.storageUsage > videoSize) user.storageUsage -= videoSize;
      else user.storageUsage = 0;
      await user.save();
    } catch (err) {
    } finally {
      await deleteFilesFromS3([videoKey!]);
    }

    const thumbnailKey = lesson.thumbnailUrl?.split("/").pop();
    if (lesson.thumbnailUrl) await deleteFilesFromS3([thumbnailKey!]);

    // Delete lesson object
    await lesson.deleteOne();

    res.status(StatusCodes.OK).json(successRes("Lesson deleted successfully"));
  } catch (err: any) {
    res
      .status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorRes(err.message));
  }
};

export default deleteLessonById;
