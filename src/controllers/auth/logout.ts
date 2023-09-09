import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { OTP } from "../../models";
import { CustomRequest, errorRes, successRes } from "../../utils";

const logout = async (req: CustomRequest, res: Response) => {
    try {
        const { user } = req;
        await OTP.findOneAndDelete({ user: user._id });

        res.cookie("accessToken", "logout", {
            httpOnly: true,
            expires: new Date(Date.now()),
        });
        res.cookie("refreshToken", "logout", {
            httpOnly: true,
            expires: new Date(Date.now()),
        });

        res.status(StatusCodes.OK).json(successRes("Logged out successfully"));
    } catch (err: any) {
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
            errorRes(err.message)
        );
    }
};

export default logout;
