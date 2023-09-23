import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { OTP, Token, User } from "../../models";
import {
    errorRes,
    createJWT,
    successRes,
    CustomRequest,
    badRequestError,
    unAuthorizedError,
    generateRefreshToken,
} from "../../utils";

const verifyOTP = async (req: CustomRequest, res: Response) => {
    try {
        const { otp } = req.body;
        const { token } = req.params;

        const otpExists = await OTP.findOne({ otp });
        const tokenExists = await Token.findOne({ token });
        const user = await User.findOne({ _id: otpExists?.user });

        if (
            !tokenExists ||
            !user ||
            tokenExists?.user.toString() !== otpExists?.user.toString()
        ) {
            throw unAuthorizedError(
                "Authentication failed. Invalid token or OTP"
            );
        } else if (!otpExists) {
            throw badRequestError("Invalid OTP");
        }

        // Get the users fields that will be returned
        const { _id, email, phoneNumber } = user;

        // Create an access token and send it as a response
        // Create a refresh token and send it as a cookie.
        const accessToken = await createJWT({ user });
        const refreshToken = await generateRefreshToken({ user });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            secure: true, // Set to true if using HTTPS
        });

        // Delete every token and otp associated with the user
        await OTP.deleteMany({ user: user._id });
        await Token.deleteMany({ user: user._id });

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
