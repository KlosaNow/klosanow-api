import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { tokenGenerator, transformPhone } from "../../helpers";
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
        if (!email?.trim() || !phoneNumber?.trim()) {
            throw badRequestError("Please provide all required fields");
        }
        const phone = transformPhone(phoneNumber);

        // Check if a user with the passed email AND phone number exists
        const user = await User.findOne({ email, phoneNumber: phone });
        if (!user) {
            throw badRequestError(
                "User with that email and phone number does not exist"
            );
        }

        const otp = await sendOtpService(user._id, email, phone);
        const token = await tokenGenerator(user._id);

        res.status(StatusCodes.OK).json(
            successRes("OTP sent successfully", { otp, token })
        );
    } catch (err: any) {
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
            errorRes(err.message)
        );
    }
};

export default loginUser;
