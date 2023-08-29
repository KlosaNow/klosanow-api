import { badRequestError } from "../../utils/CustomError";
import { User } from "../../models";
import { Request, Response } from "express";
import { successRes, transformPhone } from "../../helpers";

import { attachCookiesToResponse } from "../../utils/jwt";
import { StatusCodes } from "http-status-codes";
import sendOtpService from "../../services/otpService";

const registerUser = async (req: Request, res: Response) => {
    const { email, name, phoneNumber, role } = req.body;

    if (!email || !name || !phoneNumber) {
        throw badRequestError("Please provide all required fields");
    }

    const phone = transformPhone(phoneNumber);

    const alreadyExists = await User.findOne({ email, phone });
    if (alreadyExists) {
        throw badRequestError(
            "User with that email or phone number already exists"
        );
    }

    const newUser = new User({ email, name, phoneNumber: phone, role });
    const otp = await sendOtpService(newUser._id, phone, email);
    await newUser.save();
    attachCookiesToResponse({ res, user: newUser });

    res.status(StatusCodes.CREATED).json(
        successRes("User created successfully. OTP sent", { otp })
    );
};

export default registerUser;
