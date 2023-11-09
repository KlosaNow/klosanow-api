import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { uploadFileToS3 } from "../../services";
import { CustomRequest, errorRes, successRes } from "../../utils";

const uploadVideo = async (req: CustomRequest, res: Response) => {
  try {
    const { url: videoUrl, size: videoSize } = await uploadFileToS3(req.file);
    res
      .status(StatusCodes.OK)
      .json(successRes("Video uploaded successfully", { videoUrl, videoSize }));
  } catch (err: any) {
    res
      .status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(errorRes(err.message));
  }
};

export default uploadVideo;
