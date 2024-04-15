import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Draft } from "../../models";
import {
    errorRes,
    successRes,
    CustomRequest,
    notFoundError,
} from "../../utils";

const updateDraftById = async (req: CustomRequest, res: Response) => {
    try {
        const { id } = req.params;
        const draft = await Draft.findByIdAndUpdate({ _id: id }, req.body, {
            new: true,
        });
        if (!draft) throw notFoundError("Draft not found");

        res.status(StatusCodes.OK).json(
            successRes("Draft updated successfully", draft)
        );
    } catch (err: any) {
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
            errorRes(err.message)
        );
    }
};

export default updateDraftById;
