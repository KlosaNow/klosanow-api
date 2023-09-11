import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { OTP } from "../../models";
import {
    errorRes,
    createJWT,
    successRes,
    CustomRequest,
    badRequestError,
    generateRefreshToken,
} from "../../utils";

const verifyOTP = async (req: CustomRequest, res: Response) => {
    try {
        const { otp } = req.body;
        const { user } = req;

        const otpExists = await OTP.findOne({ user: user._id, otp });
        if (!otpExists) {
            throw badRequestError("Invalid OTP");
        }

        // Create an access token and send it as a response
        // Create a refresh token and send it as a cookie.
        const accessToken = await createJWT({ user });
        const refreshToken = await generateRefreshToken({ user });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            secure: true, // Set to true if using HTTPS
        });

        await OTP.deleteMany({ user: user._id });
        const { _id, email, phoneNumber } = user;
        res.status(StatusCodes.OK).json(
            successRes("OTP Verified Successfully", {
                user: { _id, email, phoneNumber },
                token: accessToken,
            })
        );
    } catch (err: any) {
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
            errorRes(err.message)
        );
    }
};

export default verifyOTP;
