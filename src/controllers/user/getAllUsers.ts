import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { User } from "../../models";
import { CustomRequest, successRes, errorRes } from "../../utils";

const getAllUsers = async (req: CustomRequest, res: Response) => {
    try {
        const users = await User.find({});
        res.status(StatusCodes.OK).json(
            successRes("Users returned successfully", users)
        );
    } catch (err: any) {
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
            errorRes(err.message)
        );
    }
};

export default getAllUsers;
