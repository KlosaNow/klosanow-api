import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { User } from "../../models";
import {
    errorRes,
    successRes,
    CustomRequest,
    notFoundError,
} from "../../utils";

const getUserById = async (req: CustomRequest, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ _id: id });
        if (!user) throw notFoundError("User not found");
        res.status(StatusCodes.OK).json(
            successRes("User returned successfully", user)
        );
    } catch (err: any) {
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
            errorRes(err.message)
        );
    }
};

export default getUserById;
