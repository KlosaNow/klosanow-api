import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { transformPhone } from "../../helpers";
import { User } from "../../models";
import { sendOtpService } from "../../services";
import {
    errorRes,
    createJWT,
    successRes,
    badRequestError,
    generateRefreshToken,
} from "../../utils";

const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, phoneNumber } = req.body;
        if (!email.trim() || !phoneNumber.trim()) {
            throw badRequestError("Please provide all required fields");
        }
        const phone = transformPhone(phoneNumber);

        // Check if a user with the passed email AND phone number exists
        const user = await User.findOne({ email, phoneNumber: phone });
        console.log(user);
        if (!user) {
            throw badRequestError(
                "User with that email and phone number does not exist"
            );
        }

        // Create an access token and send it as a response
        // Create a refresh token and send it as a cookie.
        const accessToken = await createJWT({ user });
        const refreshToken = generateRefreshToken({ user });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            secure: true, // Set to true if using HTTPS
        });
        const otp = await sendOtpService(user._id, email, phone);

        res.status(StatusCodes.OK).json(
            successRes("OTP sent successfully", { otp, token: accessToken })
        );
    } catch (err: any) {
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
            errorRes(err.message)
        );
    }
};

export default loginUser;
