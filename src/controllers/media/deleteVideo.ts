import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { User } from "../../models";
import { deleteFilesFromS3, getFileSizeFromS3 } from "../../services";
import {
  errorRes,
  successRes,
  CustomRequest,
  badRequestError,
} from "../../utils";

const deleteVideo = async (req: CustomRequest, res: Response) => {
  try {
    const { videoUrl, thumbnailUrl } = req.body;
    if (!videoUrl?.trim()) {
      throw badRequestError("Please provide all required fields");
    }

    const videoKey = videoUrl.split("/").pop();
    const videoSize = await getFileSizeFromS3(videoKey);
    await deleteFilesFromS3([videoKey]);

    const thumbnailKey = thumbnailUrl?.split("/").pop();
    if (thumbnailUrl) await deleteFilesFromS3([thumbnailKey!]);

    // Decrement user storage usage 
    const user = await User.findById(req.user._id);
    if (!user) throw badRequestError("Invalid user");
    if (user.storageUsage > videoSize) user.storageUsage -= videoSize;
    else user.storageUsage = 0;
    await user.save();

    res.status(StatusCodes.OK).json(successRes("Video deleted successfully"));
  } catch (err: any) {
    res
      .status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorRes(err.message));
  }
};

export default deleteVideo;
