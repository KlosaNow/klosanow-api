import sendOtpService from "../../services/otpService";
import { Token, User } from "../../models";
import { badRequestError } from "../../utils/CustomError";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { attachCookiesToResponse } from "../../utils/jwt";
import { successRes } from "../../helpers";

const loginUser = async (req: Request, res: Response) => {
    const { email, phoneNumber } = req.body;

    if (!email || !phoneNumber) {
        throw badRequestError("Please provide all required fields");
    }

    const user = await User.findOne({ email, phoneNumber });
    if (!user) {
        throw badRequestError(
            "User with that email or phone number does not exist"
        );
    }

    const existingToken = await Token.findOne({ user: user._id });

    if (existingToken) {
        const { refreshToken } = existingToken;
        existingToken.otpVerified = false;
        await existingToken.save();
        const otp = await sendOtpService(user._id, phoneNumber, email);

        attachCookiesToResponse({ res, user, refreshToken });

        return res
            .status(StatusCodes.OK)
            .json(successRes("OTP sent successfully"));
    }

    const otp = await sendOtpService(user._id, phoneNumber, email);

    attachCookiesToResponse({ res, user });

    res.status(StatusCodes.OK).json(
        successRes("OTP sent successfully", { otp })
    );
};

export default loginUser;
