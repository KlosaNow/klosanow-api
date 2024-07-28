import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Draft } from "../../models";
import { CustomRequest, successRes, errorRes } from "../../utils";

const getAllDrafts = async (req: CustomRequest, res: Response) => {
    try {
        const user = req.user;
        const drafts = await Draft.find({user});
        res.status(StatusCodes.OK).json(
            successRes("Drafts returned successfully", drafts)
        );
    } catch (err: any) {
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
            errorRes(err.message)
        );
    }
};

export default getAllDrafts;
