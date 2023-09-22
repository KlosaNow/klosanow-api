import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { User } from "../../models";
import {
    errorRes,
    successRes,
    CustomRequest,
    notFoundError,
} from "../../utils";

const updateUserData = async (req: CustomRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const user = await User.findOne({ _id: id });
        if (!user) throw notFoundError("User not found");
        user.name = name;
        await user.save();
        res.status(StatusCodes.OK).json(
            successRes("User data updated successfully", user)
        );
    } catch (err: any) {
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
            errorRes(err.message)
        );
    }
};

export default updateUserData;
