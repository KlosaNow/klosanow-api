import { StatusCodes } from "http-status-codes";
import { uploadFileToS3 } from "../../services/awsService";
import { successRes } from "../../helpers";
import { CustomRequest } from "../../utils";
import { Response } from "express";

const uploadFileHandler = async (req: CustomRequest, res: Response) => {
    const { url, size } = await uploadFileToS3(req.file);
    res.status(StatusCodes.OK).json(
        successRes("File Uploaded Successfully", { url, size })
    );
};

export default uploadFileHandler;
