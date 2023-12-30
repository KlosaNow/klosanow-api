import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { User } from "../../models";
import { uploadFileToS3 } from "../../services";
import {
  errorRes,
  successRes,
  CustomRequest,
  badRequestError,
} from "../../utils";

const uploadVideo = async (req: CustomRequest, res: Response) => {
  try {
    const { url: videoUrl, size: videoSize } = await uploadFileToS3(req.file);

    const user = await User.findById(req.user._id);
    if (!user) throw badRequestError("Invalid user");
    user.storageUsage += videoSize;
    await user.save();

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
