import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { deleteFilesFromS3 } from "../../services";
import { errorRes, badRequestError, successRes } from "../../utils";

const deleteVideo = async (req: Request, res: Response) => {
  try {
    const { videoUrl, thumbnailUrl } = req.body;
    if (!videoUrl?.trim()) {
      throw badRequestError("Please provide all required fields");
    }

    const videoKey = videoUrl.split("/").pop();
    const thumbnailKey = thumbnailUrl?.split("/").pop();
    await deleteFilesFromS3([videoKey]);
    if (thumbnailUrl) await deleteFilesFromS3([thumbnailKey!]);

    res
      .status(StatusCodes.OK)
      .json(successRes("Video deleted successfully"));
  } catch (err: any) {
    res
      .status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorRes(err.message));
  }
};

export default deleteVideo;
